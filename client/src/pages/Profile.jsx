import {Tabs} from "antd"
import AddProducts from "./AddProducts";
import UserProducts from "./userProducts";

const Profile = () => {
    const items = [
        {
            key:'1',
            label:'Products',
            children: <UserProducts/>,
        },
        {
            key:'2',
            label:'Add new product',
            children: <AddProducts/>,
        },
        {
            key:'3',
            label:'Notification',
            children: 'COntent of tab pane 1',
        },
        {
            key:'4',
            label:'Profile',
            children: 'COntent of tab pane 1',
        },

    ]
  return <> <Tabs defaultActiveKey="1" items={items} /></>
};

export default Profile;
