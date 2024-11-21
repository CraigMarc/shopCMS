import { Link } from "react-router-dom";
import Header from "./Header"

const EditOrder = (props) => {

    const {

        setLogMessage,
        orders,
        setOrders,
    
      } = props;

    return (
        <div>
            <Header
                setLogMessage={setLogMessage}
            />
            <h2>Edit Order</h2>

        </div>
    );
};

export default EditOrder;