import { useField } from "formik";
import DatePicker from "react-datepicker";
import { Form, Label } from "semantic-ui-react";

// Define a custom interface for single-date props only
interface MyDateInputProps {
  name: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
  timeCaption?: string;
  dateFormat?: string;
}

export default function MyDateInput(props: MyDateInputProps) {
  const [field, meta, helpers] = useField(props.name);

  // Handle single date selection, converting Date to ISO string
  const handleChange = (date: Date | null) => {
    helpers.setValue(date ? date.toISOString() : null);
  };

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        selected={field.value ? new Date(field.value) : null} // Expect field.value as ISO string
        onChange={handleChange}
        onBlur={field.onBlur}
        placeholderText={props.placeholderText}
        showTimeSelect={props.showTimeSelect}
        timeCaption={props.timeCaption}
        dateFormat={props.dateFormat}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}