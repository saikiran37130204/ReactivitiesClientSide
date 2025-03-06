import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  imagePreview: string;
  setCropper: (cropper: Cropper) => void;
}

export default function PhotoWidgetCropper({
  imagePreview,
  setCropper,
}: Props) {
  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: "100%" }}
      initialAspectRatio={1}
      aspectRatio={0} // Set to 1 for square cropping
      preview=".img-preview"
      guides={false}
      viewMode={0} // Allow free selection (0: no restrictions)
      autoCropArea={1} // Auto-crop the entire image
      background={false}
      onInitialized={(cropper) => setCropper(cropper)}
    />
    // <Cropper
    //   src={imagePreview}
    //   style={{ height: 200, width: "100%" }}
    //   initialAspectRatio={1}
    //   aspectRatio={1}
    //   preview=".img-preview"
    //   guides={false}
    //   viewMode={1}
    //   autoCropArea={1}
    //   background={false}
    //   onInitialized={(cropper) => setCropper(cropper)}
    // />
  );
}
