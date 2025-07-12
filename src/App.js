import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./reuseable/Loader";
import Layout from "./layout/Layout";
import PrivateRoute from "./layout/PrivateRoute";
import "./App.css";
import POSInterface from "./pages/POSInterface";
import Wallettransaction from "./pages/Wallettransaction";

function App() {
  
  const Dashboard = lazy(() => import("./pages/Dashboard"));
  const Accounts = lazy(() => import("./pages/Accounts"));
  const Login = lazy(() => import("./pages/Login"));
  const Transaction = lazy(() => import("./pages/Transaction"));
  const DualTransaction = lazy(() => import("./pages/DualTransaction"));
  const Inventory = lazy(() => import("./pages/Inventory"));
  const TransactionReport = lazy(() => import("./pages/TransactionReport"));
  const SalesReport = lazy(() => import("./pages/SalesReport"));
  const CreditReport = lazy(() => import("./pages/CreditReport"));
  const Ledger = lazy(() => import("./pages/Ledger"));
  const StockReport = lazy(() => import("./pages/StockReport"));
  const Products = lazy(() => import("./pages/Products"));
  const Dateset = lazy(() => import("./pages/Dateset"));
  const ReportsMenu = lazy(() => import("./pages/ReportsMenu"));
  const Profit = lazy(() => import("./pages/Profit"));
  const FileChecker = lazy(() => import("./pages/FileChecker"));
  const ProductLedger = lazy(() => import("./pages/ProductLedger"));
  const DummyProduct = lazy(() => import("./pages/dummy/DummyProduct"));
  const DummyAccount = lazy(() => import("./pages/dummy/DummyAccount"));
  const DummyProductnew = lazy(() => import("./pages/dummy/DummyProductnew"));
  const Finalreport = lazy(() => import("./pages/Finalreport"));
  const PaymentUi = lazy(() => import("./pages/PaymentUi"));
  const BankLedger = lazy(() => import("./pages/Bankledger"));
  const Signup = lazy(() => import("./pages/Signup"));
  const Universalform = lazy(() => import("./pages/Universalform"));
  const Machinereading = lazy(() => import("./pages/Machinereading"));
  const Temporary = lazy(() => import("./pages/Temporary"));

  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" exact element={<Login />} />
          <Route path="/payment" element={<PaymentUi />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes using PrivateRoute */}
         
          <Route element={<PrivateRoute />}>
            {/* Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
             <Route
              path="/bankledger"
              element={
                <Layout>
                  <BankLedger />
                </Layout>
              }
            />
            <Route
              path="/temporary"
              element={
                <Layout>
                  <Temporary />
                </Layout>
              }
            />
            
            <Route
              path="/finalreport"
              element={
                <Layout>
                  <Finalreport />
                </Layout>
              }
            />
              <Route
              path="/reading"
              element={
                <Layout>
                  <Machinereading />
                </Layout>
              }
            />

            <Route
              path="/dummyproduct"
              element={
                <Layout>
                  <DummyProduct />
                </Layout>
              }
            />
            <Route
              path="/dummyproductnew"
              element={
                <Layout>
                  <DummyProductnew />
                </Layout>
              }
            />
             <Route
              path="/pos"
              element={
             
                  <POSInterface />
              
              }
            />
             <Route
              path="/wallet"
              element={
                <Layout>
                  <Wallettransaction />
                  </Layout>
              }
            />
             <Route
              path="/dummyaccount"
              element={
                <Layout>
                  <DummyAccount />
                </Layout>
              }
            />
            <Route
              path="/productledger"
              element={
                <Layout>
                  <ProductLedger />
                </Layout>
              }
            />
            <Route
              path="/filecheck"
              element={
                <Layout>
                  <FileChecker />
                </Layout>
              }
            />
            <Route
              path="/profit"
              element={
                <Layout>
                  <Profit />
                </Layout>
              }
            />
            <Route
              path="/reportmenu"
              element={
                <Layout>
                  <ReportsMenu />
                </Layout>
              }
            />
           
            <Route
              path="/dateset"
              element={
                <Layout>
                  <Dateset />
                </Layout>
              }
            />
           
            <Route
              path="/products"
              element={
                <Layout>
                  <Products />
                </Layout>
              }
            />
           
            <Route
              path="/transactionreport"
              element={
                <Layout>
                  <TransactionReport />
                </Layout>
              }
            />
            <Route
              path="/stockreport"
              element={
                <Layout>
                  <StockReport />
                </Layout>
              }
            />
              <Route
              path="/universal"
              element={
                <Layout>
                  <Universalform />
                </Layout>
              }
            />
            <Route
              path="/creditreport"
              element={
                <Layout>
                  <CreditReport />
                </Layout>
              }
            />
            <Route
              path="/salesreport"
              element={
                <Layout>
                  <SalesReport />
                </Layout>
              }
            />
            <Route
              path="/ledger"
              element={
                <Layout>
                  <Ledger />
                </Layout>
              }
            />
            <Route
              path="/accounts"
              element={
                <Layout>
                  <Accounts />
                </Layout>
              }
            />
            <Route
              path="/transaction"
              element={
                <Layout>
                  <Transaction />
                </Layout>
              }
            />
            <Route
              path="/dualtransaction"
              element={
                <Layout>
                  <DualTransaction />
                </Layout>
              }
            />
            <Route
              path="/inventory"
              element={
                <Layout>
                  <Inventory />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
