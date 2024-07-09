import { Button, Modal } from "react-bootstrap";


const BalanceModal = (props) => {
    return (
    <>
      <Modal size="lg" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>PUG Balance from REST-API</Modal.Title>
        </Modal.Header>
        <Modal.Body>The $PUG balance for <br />{props.address} is:<br />
        <b>{props.balance} PUG</b></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
}

export default BalanceModal;
