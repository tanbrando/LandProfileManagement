const MainHeader = ({ title, initFunction, exportFunction }) => {
    return (
        <div className="main-header">
            <h2 className="main-header__title">{title}</h2>

            {initFunction && (
            <button className="btn btn--green me-2" onClick={initFunction}>
                Initialize
            </button>
            )}
            {exportFunction && (
            <button className="btn btn-secondary" onClick={exportFunction}>
                Xuất Báo Cáo
            </button>
            )}
        </div>
    );
};

export default MainHeader;