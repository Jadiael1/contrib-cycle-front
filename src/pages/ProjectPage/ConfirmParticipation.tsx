import { Button } from "@/components/ui/Button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/Modal";

const ConfirmParticipation = ({
	isOpen,
	onClose,
	onConfirm,
	isPending,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	isPending: boolean;
}) => {
	return (
		<Modal isOpen={!!isOpen} onClose={() => onClose()}>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>Confirmação de participação</ModalTitle>
					<ModalDescription>
						Tem certeza que deseja participar do projeto?
					</ModalDescription>
				</ModalHeader>
				<ModalFooter>
					<Button
						variant="secondary"
						className="cursor-pointer"
						onClick={() => onClose()}
					>
						Cancelar
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							onConfirm();
						}}
						isLoading={isPending}
						className="cursor-pointer"
					>
						Participar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
export default ConfirmParticipation;
