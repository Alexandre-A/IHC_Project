import { FiXCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

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
      bg: 'bg-green-300',
      text: 'text-green-800',
      icon: <FiCheckCircle size={40} />,
    },
    error: {
      bg: 'bg-red-300',
      text: 'text-red-800',
      icon: <FiXCircle size={40} />,
    },
    info: {
      bg: 'bg-blue-300',
      text: 'text-blue-800',
      icon: <FiInfo size={40} />,
    },
    warning: {
      bg: 'bg-yellow-300',
      text: 'text-yellow-800',
      icon: <FiAlertTriangle size={40} />,
    },
  };

  const { bg, text, icon } = config[type] || config.info;

  const toastContent = (
    <div className={`flex gap-2 ${bg} ${text} p-4 rounded-lg shadow-lg`}>
      {icon}
      <div>
        <h3 className="font-bold">{header}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );

  toast.open(toastContent, timeout);
};