import * as Icons from "lucide-react";

const TabIcon = ({ name }) => {
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent size={18} className="mr-1" /> : null;
};
export default TabIcon