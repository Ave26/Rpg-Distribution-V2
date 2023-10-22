import { useMyContext } from "@/contexts/AuthenticationContext";

type TRole = "SuperAdmin" | "Admin" | "Staff" | "Driver";

type TRoleToComponent = {
  SuperAdmin: () => JSX.Element | undefined;
  Admin: () => JSX.Element | undefined;
  Staff: () => JSX.Element | undefined;
  Driver: () => JSX.Element | undefined;
};

function useMapComponent(mapComponent: TRoleToComponent) {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;

  const MappedComponent = mapComponent[role as TRole]
    ? mapComponent[role as TRole]()
    : null;

  return { MappedComponent };
}

export default useMapComponent;
