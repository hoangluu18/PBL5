import React from 'react';

interface ProductDescriptionTabProps {
    description: string;
}

const ProductDescriptionTab: React.FC<ProductDescriptionTabProps> = ({ description }) => {
    return (
        <div className="shadow-sm"
            style={{ backgroundColor: "#fff", padding: "20px" }}
        >
            <style>
                {`
                    // li {
                    //     list-style-type: disc !important; 
                    // }
                    // ul {
                    //     list-style-type: disc !important; 
                    // }
                `}
            </style>
            <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
    );
};

export default ProductDescriptionTab;