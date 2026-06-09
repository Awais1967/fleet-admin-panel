import React from "react";
import Alert from "./Alert";

export default function ErrorState({ message = "Something went wrong." }) {
  return <Alert type="danger">{message}</Alert>;
}
