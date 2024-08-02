interface userCardI {
  name: string;
  role: string;
}
const UserCard: React.FC<userCardI> = ({ name, role }) => {
  return (
    <div className=" flex justify-between border px-4 py-2 shadow-sm rounded-lg">
      <div>{name}</div>
      <div>{role}</div>
    </div>
  );
};

export default UserCard;
