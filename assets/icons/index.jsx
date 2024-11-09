import React from "react";
import { theme } from "../../constants/theme";
import ArrowLeft from "./ArrowLeft";
import Call from "./Call";
import Camera from "./Camera";
import Comment from "./Comment";
import Delete from "./Delete";
import Edit from "./Edit";
import Heart from "./Heart";
import Home from "./Home";
import Image from "./Image";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./Logout";
import Mail from "./Mail";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsCircle from "./ThreeDotsCircle";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";
import Github from "./Github";
const icons = {
  arrowLeft: ArrowLeft,
  call: Call,
  camera: Camera,
  comment: Comment,
  delete: Delete,
  edit: Edit,
  heart: Heart,
  home: Home,
  image: Image,
  location: Location,
  lock: Lock,
  logout: Logout,
  mail: Mail,
  plus: Plus,
  search: Search,
  send: Send,
  share: Share,
  threeDotCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  user: User,
  video: Video,
  github: Github,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;
