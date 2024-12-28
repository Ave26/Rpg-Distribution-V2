import { useMyContext } from "@/contexts/AuthenticationContext";

type TRole = "SUPERADMIN" | "ADMIN" | "STAFF" | "DRIVER";

type TRoleToComponent = {
  SUPERADMIN: () => JSX.Element | undefined;
  ADMIN: () => JSX.Element | undefined;
  STAFF: () => JSX.Element | undefined;
  DRIVER: () => JSX.Element | undefined;
};

function useMapComponent(mapComponent: TRoleToComponent) {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.role;

  const MappedComponent = mapComponent[role as TRole]
    ? mapComponent[role as TRole]()
    : null;

  return { MappedComponent };
}

export default useMapComponent;
