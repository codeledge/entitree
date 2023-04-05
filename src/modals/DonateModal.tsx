import DonateButtons from "components/DonateButtons";
import { Button, Modal, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSetting } from "store/settingsSlice";

export default function DonateModal({ onHideModal }) {
  const dispatch = useDispatch();

  return (
    <Modal show onHide={onHideModal} backdrop="static">
      <Modal.Header>
        <Modal.Title>We hope you are enjoying EntiTree</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="success" className="mb1">
          Donate now to keep this tool completely <b>ad-free</b> and{" "}
          <b>open source</b>.
        </Alert>
        <DonateButtons />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          className="mr-auto"
          onClick={() => {
            dispatch(
              setSetting({
                hasDonatedAt: new Date(),
              }),
            );
            onHideModal();
          }}
        >
          I have donated!
        </Button>

        <Button variant="primary" onClick={onHideModal}>
          Remind me later
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
