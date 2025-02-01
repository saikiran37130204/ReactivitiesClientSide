import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Modal } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import LoginForm from "../../../features/users/LoginForm";
import { closeModel } from "../../../redux/Slice/usersSlice";
import RegisterForm from "../../../features/users/RegisterForm";

export default function ModalContainer() {
  const { open, body } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  return (
    <Modal open={open} onClose={() => dispatch(closeModel())} size="mini">
      <Modal.Content>{body === "login" && <LoginForm /> }{body === "register" && <RegisterForm />} </Modal.Content>
    </Modal>
  );
}
