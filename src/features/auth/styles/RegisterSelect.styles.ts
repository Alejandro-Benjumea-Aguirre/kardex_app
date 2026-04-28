import {StylesConfig} from 'react-select';

export const buildSelectStyles = (hasError: boolean, isDark: boolean): StylesConfig<any, false> => ({
  control: (_, state) => ({
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    padding: '0',
    border: `2px solid ${hasError ? '#ef4444' : state.isFocused ? '#3b82f6' : isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    backgroundColor: hasError
      ? (isDark ? '#1a0a0a' : '#fef2f2')
      : state.isFocused
        ? (isDark ? '#0d1526' : '#ffffff')
        : (isDark ? '#0f172a' : '#f8fafc'),
    boxShadow: state.isFocused && !hasError ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
    fontSize: '0.95rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: isDark ? '#f1f5f9' : '#1e293b',
    cursor: 'default',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
    '&:hover': { borderColor: hasError ? '#ef4444' : state.isFocused ? '#3b82f6' : (isDark ? '#475569' : '#cbd5e1') },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 0.75rem', height: '100%' }),
  input: (base) => ({ ...base, margin: 0, padding: 0, color: isDark ? '#f1f5f9' : '#1e293b' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, padding: '0 10px', color: isDark ? '#94a3b8' : '#64748b' }),
  clearIndicator: (base) => ({ ...base, padding: '0 4px', color: isDark ? '#64748b' : '#94a3b8' }),
  placeholder: (base) => ({ ...base, color: isDark ? '#475569' : '#94a3b8', fontSize: '0.95rem', margin: 0 }),
  singleValue: (base) => ({ ...base, color: isDark ? '#f1f5f9' : '#1e293b', margin: 0 }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.14)',
    zIndex: 9999,
    marginTop: '4px',
    backgroundColor: isDark ? '#1e293b' : 'white',
    border: isDark ? '1px solid #334155' : 'none',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
        ? (isDark ? '#0f172a' : '#f0f9ff')
        : (isDark ? '#1e293b' : 'white'),
    color: state.isSelected ? 'white' : (isDark ? '#f1f5f9' : '#1e293b'),
    fontSize: '0.92rem',
    cursor: 'pointer',
    padding: '0.55rem 1rem',
  }),
});