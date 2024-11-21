import { Link } from "react-router-dom";
import Header from "./Header"

const Orders = (props) => {

  const {

    setLogMessage,

  } = props;

  return (
    <div>
      <Header
        setLogMessage={setLogMessage}
      />
      <h2>Orders</h2>

    </div>
  );
};

export default Orders;