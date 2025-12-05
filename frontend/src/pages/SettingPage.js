import React, { useState } from "react";
import EditUserForm from "../features/user/EditUserForm";
import ChangePasswordForm from "../features/user/ChangePasswordForm";
import { useUser } from "../hooks/useUser";
import LoadingOverlay from "../components/LoadingOverlay";
import PageHeader from "../components/MainHeader";
import { Row, Col } from "react-bootstrap";
import "./Page.css";

const SettingPage = () => {
    const { user, loading, error, refetch } = useUser();
    if (loading) {
        return <LoadingOverlay />;
    }
    if (error) {
        return <div className="error-message">Lỗi: {error}</div>;
    }
    return (
        <>
            <PageHeader title="Cài đặt tài khoản" />
            <div className="tab-content">
                <Row>
                    <Col md={6}>
                        <EditUserForm
                            userData={user}
                            onUpdate={refetch}
                        />
                    </Col>
                    <Col md={6}>
                        <ChangePasswordForm />
                    </Col>
                </Row>  
            </div>
        </>
    );
}

export default SettingPage;