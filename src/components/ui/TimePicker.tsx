"use client";

import React, { forwardRef, useMemo } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import GlobalStyles from '@mui/material/GlobalStyles';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/id';
import { cn } from "@/lib/utils";
import { useId } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { Icons } from "@/components/Icons";

interface TimePickerProps {
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  ({ value, onChange, label, error, required, disabled, className }, ref) => {
    const id = useId();
    const { theme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark" || theme === "dark";
    const [open, setOpen] = React.useState(false);
    
    const muiTheme = useMemo(() => createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: isDark ? '#FFFFFF' : '#000000',
          },
          background: {
            paper: isDark ? '#1F2937' : '#FFFFFF',
            default: isDark ? '#111928' : '#FFFFFF',
          },
          text: {
            primary: isDark ? '#FFFFFF' : '#111928',
          }
        },
        typography: {
            fontFamily: 'inherit',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
                border: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                padding: '4px',
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: 700,
                textTransform: 'uppercase',
              }
            }
          }
        }
      }), [isDark]);
    const parsedValue = value ? dayjs(`2000-01-01T${value}`) : null;

    const handleTimeChange = (newValue: Dayjs | null) => {
      if (newValue && onChange) {
        onChange(newValue.format("HH:mm"));
      }
    };

    return (
      <div className={cn("w-full", className)} ref={ref}>
        {label && (
          <label htmlFor={id} className="mb-2.5 block text-sm font-semibold text-dark-5 dark:text-dark-6">
            {label}
            {required && <span className="ml-1 text-red">*</span>}
          </label>
        )}
        
        <div className="relative">
            <ThemeProvider theme={muiTheme}>
                <GlobalStyles styles={{
                  '.MuiTimeClock-root': {
                    display: 'flex !important',
                    flexDirection: 'column !important',
                    alignItems: 'center !important',
                  },
                  '.MuiTimeClock-arrowSwitcher': {
                    position: 'static !important',
                    order: '2',
                    display: 'flex !important',
                    justifyContent: 'center !important',
                    marginTop: '8px !important',
                    top: 'unset !important',
                    right: 'unset !important',
                  },
                  '.MuiClock-root': {
                    order: '1',
                  }
                }} />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
                    <MobileTimePicker
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      value={parsedValue}
                      onChange={handleTimeChange}
                      onAccept={() => setOpen(false)}
                      disabled={disabled}
                      ampm={false}
                      localeText={{
                        toolbarTitle: 'PILIH JAM',
                        cancelButtonLabel: 'BATAL',
                        okButtonLabel: 'OKE',
                      }}

                      slotProps={{
                        toolbar: { hidden: false },
                        textField: {
                          fullWidth: true,
                          onClick: () => !disabled && setOpen(true),
                          inputProps: {
                            placeholder: "00:00",
                            readOnly: true,
                            style: { cursor: 'pointer' }
                          },
                          InputProps: {
                            endAdornment: (
                              <div className="text-dark-5">
                                <Icons.Clock size={18} />
                              </div>
                            ),
                          },
                          sx: {
                            '& .MuiInputBase-root': {
                              height: '48px',
                              borderRadius: '8px',
                              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                              border: isDark ? '2px solid #374151' : '2px solid #E5E7EB',
                              '&:hover': {
                                borderColor: isDark ? '#6B7280' : '#D1D5DB',
                              },
                              '&.Mui-focused': {
                                borderColor: isDark ? '#FFFFFF' : '#000000',
                              },
                              '&.Mui-disabled': {
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              },
                              paddingLeft: '12px',
                              cursor: 'pointer',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiInputBase-input': {
                              fontSize: '14px',
                              fontWeight: 600,
                              color: isDark ? '#FFFFFF' : '#111928',
                            }
                          }
                        }
                      }}
                    />
                </LocalizationProvider>
            </ThemeProvider>
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
