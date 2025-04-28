import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import SigninPage from "./components/templates/authentication/SigninPage";
import ForgetPassPage from "./components/templates/authentication/ForgetPasswordPage";
import AcceptPage from "./components/templates/authentication/AcceptPage";
import Cookies from "js-cookie";
import BookCategoryPage from "./components/templates/pages/BookCategoryPage";
import Dashboard from "./components/templates/pages/Dashboard";
import BookListPage from "./components/templates/pages/BookListPage";
import ChaptersPage from "./components/templates/pages/ChaptersPage";
import CommentsPage from "./components/templates/pages/CommentsPage";
import QuestionsPage from "./components/templates/pages/QuestionsPage";
import BookCodePage from "./components/templates/pages/BookCodePage";
import { isTokenValid } from "./auth";
import DocumentsPage from "./components/templates/pages/DocumentsPage";
import TestsPage from "./components/templates/pages/TestsPage";
import AnswersPage from "./components/templates/pages/AnswersPage";
import VideosPage from "./components/templates/pages/VideosPage";
import AllCodesPage from "./components/templates/pages/AllCodesPage";
import CodesLogPage from "./components/templates/pages/CodesLogPage";
import RepeatedCodesPAge from "./components/templates/pages/RepetatedCodes";
import LogsPage from "./components/templates/pages/LogsPage";
import EmailSettingPage from "./components/templates/pages/EmailSettingPage";
import SearchSettingPage from "./components/templates/pages/SearchSettingPage";
import SettingsPage from "./components/templates/pages/UpdateSettingsPage";

const Authorized = ({ element }) => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  return token && isTokenValid(navigate) ? (
    <Navigate replace to="/dashboard" />
  ) : (
    element
  );
};

const UnAuthorized = ({ element }) => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  return token && isTokenValid(navigate) ? (
    element
  ) : (
    <Navigate replace to="/signin" />
  );
};

function App() {
  return (
    <Routes>
      {/* Pages accessible without login */}
      <Route path="/signin" element={<Authorized element={<SigninPage />} />} />
      <Route
        path="/forgetPass"
        element={<Authorized element={<ForgetPassPage />} />}
      />
      <Route path="/accept" element={<Authorized element={<AcceptPage />} />} />

      {/* Pages accessible only when logged in, wrapped with Layout */}
      <Route
        path="/*"
        element={
          <UnAuthorized
            element={
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/bookcategories"
                    element={<BookCategoryPage />}
                  />
                  <Route path="/codesList" element={<AllCodesPage />} />
                  <Route path="/connectedCodesLog" element={<CodesLogPage />} />
                  <Route
                    path="/repeatedCodes"
                    element={<RepeatedCodesPAge />}
                  />
                  <Route
                    path="/updateSettings"
                    element={<SettingsPage />}
                  />
                  <Route
                    path="/searchSetting"
                    element={<SearchSettingPage />}
                  />
                  <Route path="/emails" element={<EmailSettingPage />} />
                  <Route path="/log" element={<LogsPage />} />
                  <Route path="/bookslist" element={<BookListPage />} />
                  <Route path="/chapters/:id" element={<ChaptersPage />} />
                  <Route path="/comments" element={<CommentsPage />} />
                  <Route path="/bookCodes/:id" element={<BookCodePage />} />
                  <Route
                    path="/chapters/:id/documents/"
                    element={<DocumentsPage />}
                  />
                  <Route
                    path="/chapters/:id/videos/"
                    element={<VideosPage />}
                  />
                  <Route
                    path="/chapters/:id/tests/:chapterId"
                    element={<TestsPage />}
                  />
                  <Route
                    path="/chapters/:id/tests/:chapterId/questions/:testId"
                    element={<QuestionsPage />}
                  />
                  <Route
                    path="/chapters/:id/tests/:chapterId/questions/:testId/answer/:quesId"
                    element={<AnswersPage />}
                  />
                  <Route
                    path="/chapters/:id/tests/:chapterId/audios/:testId"
                    element={<AnswersPage />}
                  />
                </Routes>
              </Layout>
            }
          />
        }
      />
    </Routes>
  );
}

export default App;
