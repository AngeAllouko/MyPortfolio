import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
      </span>
      <span>{msg}</span>
      <button className="toast-close" onClick={onClose}>
        <X size={13} />
      </button>
    </div>
  );
}
