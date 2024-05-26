import React, { useEffect, useState } from "react";
import { client } from "./lib/pocketbase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const RecordComponent = () => {
  const [allrecords, setAllRecords] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deletingData, setDeletingData] = useState([]);
  const [updateRecord, setUpdateRecord] = useState({
    title: "",
    description: "",
  });

  const [newRecord, setNewRecord] = useState({
    title: "",
    description: "",
  });
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    getAllRecords();
  }, []);

  const getAllRecords = () => {
    client
      .collection("todos")
      .getFullList()
      .then((res) => {
        setAllRecords(res);
      });
  };

  const setRecordToEdit = (record) => {
    if (isEdit && editingData && editingData.id === record.id) {
      setEditingData(null);
      setIsEdit(false);
    } else {
      setEditingData(record);
      setUpdateRecord({
        title: record.title,
        description: record.description,
      });
      setIsEdit(true);
    }
  };

  const handleEditChange = (e) => {
    const { value, name } = e.target;
    setUpdateRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditData = () => {
    client
      .collection("todos")
      .update(editingData.id, updateRecord)
      .then((res) => {
        if (res) {
          console.log("record updated successfully!!", res);
          setIsEdit(false);
          setEditingData(null);
          getAllRecords();
        }
      });
  };

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setNewRecord({
        ...newRecord,
        title: value,
      });
    }
    if (name === "description") {
      setNewRecord({
        ...newRecord,
        description: value,
      });
    }
  };

  const submitNewRecord = async () => {
    client
      .collection("todos")
      .create(newRecord)
      .then((res) => {
        getAllRecords();
        handleClose();
      });
  };

  const setDatatoDelete = (record) => {
    setDeletingData(record);
    handleShowDelete();
  };

  const deleteRecord = async () => {
    client
      .collection("todos")
      .delete(deletingData.id)
      .then((res) => {
        if (res) {
          handleCloseDelete();
          getAllRecords();
        }
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add New Record
      </Button>
      <h3>Records here...</h3>
      {allrecords.map((mappedRecord, index) => {
        return (
          <div className="row" key={mappedRecord.id}>
            <div className="col-md-6">
              <ul>
                <li>
                  <div className="d-flex">
                    <h4>{mappedRecord.title}</h4>
                    <button
                      className="btn btn-secondary btn-sm mx-2"
                      onClick={() => setRecordToEdit(mappedRecord)}
                    >
                      {isEdit &&
                      editingData &&
                      editingData.id === mappedRecord.id
                        ? "Cancel"
                        : "Edit"}
                    </button>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => setDatatoDelete(mappedRecord)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      })}

      {isEdit && editingData && (
        <div className="col-md-6">
          <h4>Edit</h4>
          <div className="editform w-50">
            <div className="d-flex flex-column">
              <label htmlFor="edittitle">Title</label>
              <input
                type="text"
                name="title"
                id="editname"
                className="input"
                value={updateRecord.title}
                onChange={handleEditChange}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="editdescription">Description</label>
              <textarea
                name="description"
                id="editdescription"
                cols="30"
                rows="10"
                className="input"
                value={updateRecord.description}
                onChange={handleEditChange}
              ></textarea>
            </div>
            <div className="my-2">
              <button className="btn btn-primary" onClick={submitEditData}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header>
          <Modal.Title>Delete Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteRecord}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add a new record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="newrecordform">
            <div className="d-flex flex-column">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="enter title"
                className="input"
                onChange={handleNewRecordChange}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="description">Description</label>

              <textarea
                name="description"
                id="description"
                placeholder="enter description"
                cols="30"
                rows="10"
                className="input"
                onChange={handleNewRecordChange}
              ></textarea>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitNewRecord}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecordComponent;
