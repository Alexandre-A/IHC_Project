import { colors } from "../utils/colors";

export default function Modal({ open, onClose, children }) {
  return (
    /*
    Backdrop (Click Area): This div represents the backdrop (the dimmed 
    area behind the modal). When you click anywhere outside the modal 
    (the backdrop), it will trigger the onClose function to close the 
    modal.*/
    <div
      onClick={onClose}
      className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible" : "invisible"}
      `}
      style={{
        backgroundColor: open ? "rgba(44, 62, 80, 0.3)" : "transparent"
      }}
    >
      
      {/* modal */}
      {/*Modal Content: This div represents the modal box where the content 
      is displayed. It is styled with a white background (bg-white), rounded 
      corners (rounded-xl), padding (p-6), and a shadow (shadow).

      Preventing Clicks from Closing the Modal: The onClick={(e) => e.stopPropagation()} 
      prevents clicks inside the modal from propagating up to the backdrop div, 
      which would trigger onClose (i.e., close the modal). So, clicking 
      inside the modal will not close it. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
        style={{
          backgroundColor: colors.light,
          border: `1px solid ${colors.secondary}`
        }}
      >
        {children}
      </div>
    </div>
  )
}
