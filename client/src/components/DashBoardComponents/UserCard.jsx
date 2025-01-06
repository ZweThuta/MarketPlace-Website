import { Card, Metric, Text } from "@tremor/react";
import {
    UserGroupIcon,
} from "@heroicons/react/24/solid";

const UserCard = ({ users }) => {  
  return (
    <Card
      className=" max-w-xs flex items-center justify-between"
      decoration="top"
      decorationColor="black"
    >
      <div>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Active Users
        </p>
        <p className="text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {users.length}
        </p>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg">
        <UserGroupIcon className="w-8 h-8 text-green-500" />
      </div>
    </Card>
  );
};
export default UserCard;
