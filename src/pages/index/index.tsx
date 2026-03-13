import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "zmp-ui";
import { useAuth } from "@/hooks/login/useAuth";
import { ROUTES } from "@/config";
import { LoadingScreen } from "./components/LoadingScreen";

function IndexPage() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const isAuthenticated = await checkAuth();

        setTimeout(() => {
          if (isAuthenticated) {
            navigate(ROUTES.HOME, { replace: true });
          } else {
            navigate(ROUTES.LOGIN, { replace: true });
          }
        }, 1500);
      } catch (error) {
        console.error("Check auth error:", error);
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    init();
  }, [navigate, checkAuth]);

  return (
    <Page>
      <LoadingScreen />
    </Page>
  );
}

export default IndexPage;