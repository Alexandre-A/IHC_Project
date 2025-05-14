import { FiXCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { colors } from "../../utils/colors";

/**
 * Shows a toast with different styles and icons based on type.
 * @param {Function} toast - Toast context instance (from useToast).
 * @param {Object} options - Toast configuration.
 * @param {'success' | 'error' | 'info' | 'warning'} options.type - Type of toast.
 * @param {string} options.header - Title/header of the toast.
 * @param {string} options.message - Message content of the toast.
 * @param {number} options.timeout - (Optional) Timeout duration in ms.
 */

export const showToast = (toast, { type = 'info', header, message, timeout = 5000 }) => {
  const config = {
    success: {
      backgroundColor: colors.success,
      textColor: '#FFFFFF',
      icon: <FiCheckCircle size={40} color="#FFFFFF" />,
    },
    error: {
      backgroundColor: colors.warning,
      textColor: '#FFFFFF',
      icon: <FiXCircle size={40} color="#FFFFFF" />,
    },
    info: {
      backgroundColor: colors.secondary,
      textColor: '#FFFFFF',
      icon: <FiInfo size={40} color="#FFFFFF" />,
    },
    warning: {
      backgroundColor: colors.accent,
      textColor: '#FFFFFF',
      icon: <FiAlertTriangle size={40} color="#FFFFFF" />,
    },
  };

  const { backgroundColor, textColor, icon } = config[type] || config.info;

  const toastContent = (
    <div 
      className="flex gap-2 p-4 rounded-lg shadow-lg"
      style={{ 
        backgroundColor: backgroundColor,
        color: textColor 
      }}
    >
      {icon}
      <div>
        <h3 className="font-bold">{header}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );

  toast.open(toastContent, timeout);
};