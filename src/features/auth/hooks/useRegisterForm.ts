import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {CompanyData, UserData, FormErrors} from '../types/register.types';

export function useRegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [company, setCompany] = useState<CompanyData>({
    companyName: '',
    nit: '',
    sector: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    website: '',
  });

  const [user, setUser] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  useEffect(() => {
    document.body.className = 'register-body';
    return () => { document.body.className = ''; };
  }, []);

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  const handleCompanyChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNextStep = (step?: number) => {
    if (step === 1) { setCurrentStep(1); return; }
    if (validateStep1()) setCurrentStep(2);
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!company.companyName.trim())
      newErrors.companyName = 'El nombre de la empresa es requerido';
    if (!company.nit.trim())
      newErrors.nit = 'El NIT / RUC es requerido';
    if (!company.sector)
      newErrors.sector = 'Selecciona un sector';
    if (!company.phone.trim())
      newErrors.phone = 'El teléfono es requerido';
    if (!company.address.trim())
      newErrors.address = 'La dirección es requerida';
    if (!company.city.trim())
      newErrors.city = 'La ciudad es requerida';
    if (!company.country.trim())
      newErrors.country = 'El país es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!user.firstName.trim())
    newErrors.firstName = 'El nombre es requerido';
    if (!user.lastName.trim())
    newErrors.lastName = 'El apellido es requerido';
    if (!user.email)
    newErrors.email = 'El correo es requerido';
    else if (!isValidEmail(user.email))
    newErrors.email = 'Ingresa un correo válido';
    if (!user.password)
    newErrors.password = 'La contraseña es requerida';
    else if (user.password.length < 8)
    newErrors.password = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(user.password) || !/[a-z]/.test(user.password))
    newErrors.password = 'Debe contener mayúsculas y minúsculas';
    else if (!/[0-9]/.test(user.password))
    newErrors.password = 'Debe contener al menos un número';
    if (!user.confirmPassword)
    newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (user.password !== user.confirmPassword)
    newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!user.role)
    newErrors.role = 'Selecciona un rol';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        company: {
          name:    company.companyName,
          nit:     company.nit,
          sector:  company.sector,
          phone:   company.phone,
          address: company.address,
          city:    company.city,
          country: company.country,
          website: company.website || null,
        },
        user: {
          first_name: user.firstName,
          last_name:  user.lastName,
          email:      user.email,
          password:   user.password,
          password_confirmation: user.confirmPassword,
          role:       user.role,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const fieldMap: Record<string, keyof FormErrors> = {
            'company.name':    'companyName',
            'company.nit':     'nit',
            'company.sector':  'sector',
            'company.phone':   'phone',
            'company.address': 'address',
            'company.city':    'city',
            'company.country': 'country',
            'user.first_name': 'firstName',
            'user.last_name':  'lastName',
            'user.email':      'email',
            'user.password':   'password',
            'user.role':       'role',
          };
          const serverErrors: FormErrors = {};
          Object.entries(data.errors).forEach(([key, msgs]) => {
            const mapped = fieldMap[key] ?? key.replace('user.', '').replace('company.', '') as keyof FormErrors;
            serverErrors[mapped] = (msgs as string[])[0];
          });
          setErrors(serverErrors);
          const step1Keys: (keyof FormErrors)[] = [
            'companyName','nit','sector','phone','address','city','country',
          ];
          if (Object.keys(serverErrors).some(k => step1Keys.includes(k as keyof FormErrors))) {
            setCurrentStep(1);
          }
        } else {
          setErrors({ general: data.message || 'Error al registrar. Intenta de nuevo.' });
        }
        return;
      }

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ general: 'Error de conexión. Verifica tu red e intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const progressPct = currentStep === 1 ? 50 : 100;
  
  return {
    currentStep, 
    setCurrentStep,
    company, 
    setCompany,
    user, 
    setUser,
    errors, 
    validateStep1,
    handleCompanyChange,
    handleUserChange,
    handleNextStep,
    handleSubmit,
    isLoading,
    showSuccess,
    progressPct,
  };
}