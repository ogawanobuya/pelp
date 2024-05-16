import { Modal as MuiModal, Typography, Card } from '@mui/material';
import { FC } from 'react';

interface ModalProps {
  open: boolean;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  title?: string;
  children: React.ReactNode;
}
const Modal: FC<ModalProps> = (props: ModalProps) => {
  const { open, handleClose, title, children } = props;
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card
        sx={{
          px: 4,
          py: 3,
          maxWidth: '60%',
          mt: '50vh',
          ml: '50vw',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {title ? (
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {title}
          </Typography>
        ) : null}
        {children}
      </Card>
    </MuiModal>
  );
};

export default Modal;