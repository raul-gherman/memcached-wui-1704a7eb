
import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
