import Cropper from "react-easy-crop";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { Area, Point } from "react-easy-crop";

interface imageCropModalProps {
  showCropModal: boolean;
  imageURL: string;
  handleCropCancel: () => void;
  onCrop: (croppedAreaPixels: Area) => void;
}

function ImageCropModal({
  showCropModal,
  imageURL,
  handleCropCancel,
  onCrop,
}: imageCropModalProps) {
  const zoomInit: number = 1;
  const cropInit: Point = { x: 0, y: 0 };
  const aspectRatio: number = 3 / 2; // Fixed aspect ratio of 3:2

  const [zoom, setZoom] = useState<number>(zoomInit);
  const [crop, setCrop] = useState<Point>(cropInit);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({} as Area);

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onCropComplete = (_: Area, newCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(newCroppedAreaPixels);
  };

  const onCropCancel = (): void => {
    setZoom(zoomInit);
    setCrop(cropInit);
    handleCropCancel();
  };

  return (
    <Modal show={showCropModal} dialogClassName="modal-90w">
      <Modal.Header>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: "500px" }}>
          <Cropper
            image={imageURL}
            zoom={zoom}
            crop={crop}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onCropCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={() => onCrop(croppedAreaPixels)}>
          Save Crop
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImageCropModal;
