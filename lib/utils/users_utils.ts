const getUserStatus = (enabled: boolean): "ACTIVE" | "SUSPENDED" => {
  return enabled ? "ACTIVE" : "SUSPENDED";
};