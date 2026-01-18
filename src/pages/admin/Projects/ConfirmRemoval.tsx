import { Button } from "@/components/ui/Button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/Modal";

const ConfirmRemoval = ({
	isOpen,
	onClose,
	onConfirm,
	isPending,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isPending: boolean;
}) => {
	return (
		<Modal isOpen={!!isOpen} onClose={() => onClose()}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Confirmação de exclusão</ModalTitle>
					<ModalDescription>
						Tem certeza que deseja excluir o projeto?
					</ModalDescription>
				</ModalHeader>
				<ModalFooter>
					<Button variant="secondary" onClick={() => onClose()}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							onConfirm();
						}}
						isLoading={isPending}
						className="cursor-pointer"
					>
						Excluir
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default ConfirmRemoval;
