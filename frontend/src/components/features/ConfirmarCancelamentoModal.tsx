import React from 'react';

interface ConfirmarCancelamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    agendamentosCount: number;
}

const ConfirmarCancelamentoModal: React.FC<ConfirmarCancelamentoModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    agendamentosCount,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white rounded-lg p-6 shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Cancelar Agendamentos</h2>
                <p className="mb-4">
                    {agendamentosCount} agendamentos selecionados serão cancelados. Os usuários serão notificados sobre o cancelamento.
                </p>
                <p className="mb-4">Esta ação não poderá ser desfeita.</p>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Cancelar Agendamentos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarCancelamentoModal;