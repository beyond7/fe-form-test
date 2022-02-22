import { Navigate, Route, Routes } from 'react-router-dom';
import Home from 'App/pages/Home';
import MainForm from 'App/pages/MainForm';
import SecuredRoute from './SecuredRoute';

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<SecuredRoute />}>
        <Route index element={<MainForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default MainRouter;
