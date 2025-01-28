import { useField } from "formik";
import DatePicker, { DatePickerProps } from "react-datepicker"; // Use DatePickerProps here
import { Form, Label } from "semantic-ui-react";

export default function MyDateInput(props: Partial<DatePickerProps>) {
  const [field, meta, helpers] = useField(props.name!);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <DatePicker
        {...props}
        selected={field.value ? new Date(field.value) : null} // Ensure the value is a Date object or null
        onChange={(value) => helpers.setValue(value)} // Update the Formik value
        onBlur={field.onBlur} // Pass the onBlur to Formik
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
