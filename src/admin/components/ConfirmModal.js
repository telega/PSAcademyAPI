import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

const ConfirmModal = ({ visible, onOK, onCancel, children }) => (
  <Modal visible={visible} onClickBackdrop={onCancel}>
    <div className="modal-header">
      <h5 className="modal-title">Confirm</h5>
	  <button type="button" className="close"  aria-label="Close" onClick = {onCancel}>
      	<span aria-hidden="true">&times;</span>
      	</button>
    </div>
    <div className="modal-body">
      {children}
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onOK}>
        OK
      </button>
    </div>
  </Modal>
);

ConfirmModal.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onOK: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;
