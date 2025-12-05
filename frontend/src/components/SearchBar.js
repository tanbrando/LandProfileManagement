import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const SearchBar = ({ searchConfigs, onSearch }) => {
    const [searchValue1, setSearchValue1] = useState("");
    const [searchValue2, setSearchValue2] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        let filter = {};
        if (searchValue1) {
            filter[config.label1] = searchValue1;
        }
        if (searchValue2 && config.showSecondInput) {
            filter[config.label2] = searchValue2;
        }
        onSearch(filter);
    };

    const handleClear = () => {
        setSearchValue1("");
        setSearchValue2("");
        onSearch({}); // Reset search
    };
    
    const [config, setConfig] = useState(
        searchConfigs[Object.keys(searchConfigs)[0]] || 
        {
            placeholder1: "Tìm kiếm...",
            label1: "Tìm kiếm",
            showSecondInput: false
        }
    );
    
    return (
        <Form className="search-bar mb-4" onSubmit={handleSubmit}>
            <div className="d-flex align-items-center">
                <Form.Group className="me-2 flex-grow-1">
                    <Form.Control 
                        type="text"
                        placeholder={config.placeholder1}
                        value={searchValue1}
                        onChange={(e) => setSearchValue1(e.target.value)}
                    />
                </Form.Group>
                {config.showSecondInput && (
                    <Form.Group className="me-2 flex-grow-1">
                        <Form.Control 
                            type="text"
                            placeholder={config.placeholder2}
                            value={searchValue2}
                            onChange={(e) => setSearchValue2(e.target.value)}
                        />
                    </Form.Group>
                )}

                <Form.Group className="me-2">
                    <Form.Select
                        onChange={(e) => {
                            const selectedType = e.target.value;
                            setConfig(searchConfigs[selectedType]);
                        }}
                    >
                        {Object.keys(searchConfigs).map((key) => (
                            <option key={key} value={key}>
                                {searchConfigs[key].name || key}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <button type="submit" className="btn btn--dark-green">
                    <i className="bi bi-search me-1"></i>
                    Tìm
                </button>
            </div>
        </Form>
    );
}

export default SearchBar;