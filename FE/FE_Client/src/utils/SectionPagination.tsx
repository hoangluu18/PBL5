import { Pagination } from "antd";

const SectionPagination: React.FC = () => {
    return (
        <Pagination
            total={100}
            defaultCurrent={1}
            showQuickJumper
            showSizeChanger
        />
    )
}

export default SectionPagination;