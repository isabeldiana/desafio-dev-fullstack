// components/ui/Modal.tsx
"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh] pointer-events-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <button
                onClick={onClose}
                className="absolute cursor-pointer top-4 right-4 text-gray-800 hover:text-gray-600 transition"
              >
                <X />
              </button>

              {title && (
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {title}
                </h2>
              )}

              <div className="space-y-4 text-gray-800">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
