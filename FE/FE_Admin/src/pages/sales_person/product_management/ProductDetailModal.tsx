import React, { useState, useEffect } from 'react';
import {
    Modal, Descriptions, Table, Typography, Button, Spin,
    Card, Tabs, Empty, Tag, Row, Col, Image, Form, Input, InputNumber, Switch, Upload, message,
    Avatar,
    Rate
} from 'antd';
import {
    EditOutlined, StopOutlined, PlusOutlined,
    ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, DeleteOutlined, UploadOutlined,
    LikeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { ProductDetail, ProductVariant, ProductVariantGroup } from '../../../models/ProductDetail';
import { ProductService } from '../../../services/shop/ProductService.service';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { Editor } from '@tinymce/tinymce-react';
import { Select } from 'antd';
import { ValueType } from 'rc-input/lib/interface';
import { Review } from '../../../models/Review';
import { ReviewService } from '../../../services/shop/ReviewService.service';
import { Brand } from '../../../models/Brand';
import { Category } from '../../../models/Category';

const { TabPane } = Tabs;

interface ProductDetailModalProps {
    productId: number | null;
    visible: boolean;
    onClose: () => void;
    isCreateMode?: boolean; // Thêm prop để xác định mode tạo mới
    onProductCreated?: (product: ProductDetail) => void; // Callback khi tạo thành công
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    productId, visible, onClose, isCreateMode = false, onProductCreated
}) => {
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const productService = new ProductService();
    // Thêm state và hooks
    const [editMode, setEditMode] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [specs, setSpecs] = useState<any[]>([]);
    const [editorContent, setEditorContent] = useState<string>('');
    const [variantGroups, setVariantGroups] = useState<ProductVariantGroup[]>([]);

    // Thêm các state này vào phần đầu component
    const [editingVariantGroups, setEditingVariantGroups] = useState<ProductVariantGroup[]>([]);
    const [selectedParentGroup, setSelectedParentGroup] = useState<number>(-1); // -1 = chưa chọn nhóm cha
    const [isEditingVariant, setIsEditingVariant] = useState<boolean>(false);
    // Extended type for editing a variant with group index information
    type EditingVariant = ProductVariant & { groupIndex: number };
    const [currentEditingVariant, setCurrentEditingVariant] = useState<EditingVariant | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    //State review
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
    const reviewService = new ReviewService();

    //State brand and category
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingBrands, setLoadingBrands] = useState<boolean>(false);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
    //state cho ảnh biến thể tạm thời
    const [tempVariantImages, setTempVariantImages] = useState<{ [key: string]: File }>({});
    //state cho product images
    const [productImages, setProductImages] = useState<any[]>([]);
    const [loadingImages, setLoadingImages] = useState<boolean>(false);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [pendingImages, setPendingImages] = useState<File[]>([]);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    useEffect(() => {
        if (visible) {
            if (isCreateMode) {
                // Khởi tạo form rỗng cho chế độ tạo mới
                initCreateForm();
            } else if (productId) {
                // Load chi tiết sản phẩm hiện có
                fetchProductDetail(productId);
            }
        }
    }, [productId, visible, isCreateMode]);

    useEffect(() => {
        if (productDetail) {
            // Đảm bảo fullDescription luôn là chuỗi
            let content = typeof productDetail.fullDescription === 'string'
                ? productDetail.fullDescription
                : '';

            // Thêm các thuộc tính định hướng LTR vào tất cả các thẻ HTML
            content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/gi,
                '<$1 dir="ltr" style="direction:ltr;text-align:left;" $2>');

            // Thêm container div với hướng LTR rõ ràng
            content = `<div dir="ltr" style="direction:ltr;text-align:left;">${content}</div>`;

            setEditorContent(content);
        } else if (isCreating) {
            // Với trường hợp tạo mới, đặt giá trị mặc định với hướng LTR
            setEditorContent('<div dir="ltr" style="direction:ltr;text-align:left;"></div>');
        }
    }, [productDetail, isCreating]);

    useEffect(() => {
        if (productDetail && productDetail.variantGroups) {
            setVariantGroups([...productDetail.variantGroups]);
        }
    }, [productDetail]);

    useEffect(() => {
        if (productDetail) {
            fetchReviews();
            fetchProductImages(productDetail.id);
        }
    }, [productDetail]);

    useEffect(() => {
        // Khi modal đóng (visible = false), reset các trạng thái
        if (!visible) {
            setIsCreating(false);
            setEditMode(false);
            setProductDetail(null);
            setPreviewImage('');
            setImageFile(null);
            setSpecs([]);
            setEditingVariantGroups([]);
            setSelectedParentGroup(-1);
            setEditorContent('');
            setTempVariantImages({});
        }
    }, [visible]);

    useEffect(() => {
        if (visible && (editMode || isCreating)) {
            fetchBrandsAndCategories();
        }
    }, [visible, editMode, isCreating]);


    // Hàm khởi tạo form tạo mới
    const initCreateForm = () => {
        setProductDetail(null);
        setEditMode(true);
        setIsCreating(true);

        // Reset form với giá trị mặc định
        form.resetFields();
        form.setFieldsValue({
            name: '',
            price: 0,
            cost: 0,
            discountPercent: 0,
            enabled: true,
            fullDescription: '',
            brandId: undefined,
            categoryId: undefined,
            weight: 0,
            height: 0,
            width: 0,
            length: 0,
        });

        // Khởi tạo các state khác
        setSpecs([]);
        setEditingVariantGroups([]);
        setSelectedParentGroup(-1);
        setPreviewImage('');
        setImageFile(null);
        setEditorContent('');
    };


    const fetchProductDetail = async (id: number) => {
        try {
            setLoading(true);
            const detail = await productService.getProductDetail(id);
            setProductDetail(detail);
        } catch (error) {
            console.error("Failed to load product detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrandsAndCategories = async () => {
        setLoadingBrands(true);
        setLoadingCategories(true);
        try {
            const brandsData = await productService.getAllBrands();
            const categoriesData = await productService.getAllCategories();
            setBrands(brandsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to load brands and categories:", error);
            message.error("Không thể tải thông tin thương hiệu và danh mục");
        } finally {
            setLoadingBrands(false);
            setLoadingCategories(false);
        }
    };

    // Định dạng ngày giờ
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };
    // fetch reviews
    const fetchReviews = async () => {
        if (!productDetail) return;

        setLoadingReviews(true);
        try {
            const reviewsData = await reviewService.getReviewsByProductId(productDetail.id);
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Columns cho bảng thông số sản phẩm
    const specificationColumns = [
        {
            title: 'Tên thông số',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
    ];


    // Hàm khởi tạo chế độ chỉnh sửa
    const handleEditClick = () => {
        if (!productDetail) return;

        // Khởi tạo form với dữ liệu hiện tại
        form.setFieldsValue({
            name: productDetail.name,
            price: productDetail.price,
            cost: productDetail.cost,
            discountPercent: productDetail.discountPercent || 0,
            enabled: productDetail.enabled,
            fullDescription: productDetail.fullDescription || '',
            brandId: productDetail.brandId,
            categoryId: productDetail.categoryId,
            weight: productDetail.weight || 0,
            height: productDetail.height || 0,
            width: productDetail.width || 0,
            length: productDetail.length || 0,
        });

        // Khởi tạo specs để có thể thêm/sửa/xóa
        setSpecs(productDetail.specifications ? [...productDetail.specifications] : []);

        // Sao chép sâu các nhóm biến thể để không ảnh hưởng đến dữ liệu gốc
        const deepCopyVariantGroups = JSON.parse(JSON.stringify(productDetail.variantGroups || []));
        setEditingVariantGroups(deepCopyVariantGroups);

        // Xác định nhóm biến thể cha (thường là nhóm đầu tiên có biến thể không có parentId)
        const parentGroupIndex = deepCopyVariantGroups.findIndex((group: ProductVariantGroup) =>
            group.variants.some((variant: ProductVariant) => variant.parentId === null)
        );
        setSelectedParentGroup(parentGroupIndex !== -1 ? parentGroupIndex : -1);
        setEditMode(true);
    };

    // Xử lý upload ảnh
    const handleImageUpload = (info: any) => {
        if (info.file) {
            if (info.file.size > 5 * 1024 * 1024) {
                message.error('Kích thước ảnh không được vượt quá 5MB');
                return;
            }

            const isImage = info.file.type.startsWith('image/');
            if (!isImage) {
                message.error('Chỉ chấp nhận file ảnh');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(info.file);
            setImageFile(info.file);
        }
    };

    // Xử lý các thao tác với specs
    const handleAddSpec = () => {
        setSpecs([...specs, { id: Date.now(), name: '', value: '' }]);
    };

    const handleSpecChange = (id: number, field: string, value: string) => {
        setSpecs(specs.map(spec =>
            spec.id === id ? { ...spec, [field]: value } : spec
        ));
    };

    const handleDeleteSpec = (id: number) => {
        setSpecs(specs.filter(spec => spec.id !== id));
    };




    // Lưu thông tin sản phẩm

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const discountPercentValue = values.discountPercent !== undefined && values.discountPercent !== null
            ? Number(values.discountPercent)
            : 0;

            // Khởi tạo biến để lưu trữ file ảnh tạm thời
            let tempImageFile = imageFile;

            // Chuẩn bị dữ liệu sản phẩm (không bao gồm mainImage nếu đang tạo mới)
            const productData = {
                id: isCreating ? null : productDetail?.id,
                code: isCreating ? values.code : productDetail?.code,
                name: values.name,
                alias: isCreating ? '' : productDetail?.alias,
                price: values.price,
                cost: values.cost,
                discountPercent: discountPercentValue,
                enabled: values.enabled,
                quantity: isCreating ? 0 : productDetail?.quantity,
                fullDescription: editorContent,
                // Chỉ đặt mainImage khi cập nhật, bỏ qua khi tạo mới
                mainImage: isCreating ? '' : productDetail?.mainImage,
                // Các trường khác giữ nguyên
                lastUpdated: isCreating ? null : productDetail?.lastUpdated,
                brandId: values.brandId,
                categoryId: values.categoryId,
                weight: values.weight || 0,
                height: values.height || 0,
                width: values.width || 0,
                length: values.length || 0,
                specifications: specs.filter(spec => spec.name && spec.value).map(spec => ({
                    id: spec.id > 0 ? spec.id : null,
                    name: spec.name,
                    value: spec.value
                })),
                variantGroups: editingVariantGroups.map(group => ({
                    name: group.name,
                    variants: group.variants.filter(v => v.value).map(variant => ({
                        id: variant.id,
                        key: variant.key,
                        value: variant.value,
                        quantity: variant.quantity,
                        photo: isCreating && variant.photo === 'pending-upload' ? null : variant.photo,
                        parentId: variant.parentId
                    }))
                }))
            };

            // CASE 1: Nếu đang cập nhật và có ảnh mới
            if (!isCreating && imageFile && productDetail) {
                try {
                    const imageUrl = await productService.uploadProductImage(productDetail.id, imageFile);
                    productData.mainImage = imageUrl;
                } catch (error) {
                    console.error('Error uploading image:', error);
                    message.error('Không thể tải lên hình ảnh');
                    setLoading(false);
                    return;
                }
            }

            // Gửi request tạo mới hoặc cập nhật
            let createdOrUpdatedProduct;
            if (isCreating) {
                // Tạo sản phẩm mới
                createdOrUpdatedProduct = await productService.createProductWithDetails(productData);

                // CASE 2: Nếu đang tạo mới và có ảnh, upload ảnh sau khi tạo sản phẩm
                if (tempImageFile) {
                    try {
                        const imageUrl = await productService.uploadProductImage(
                            createdOrUpdatedProduct.id,
                            tempImageFile
                        );

                        // Cập nhật mainImage của sản phẩm sau khi upload ảnh
                        createdOrUpdatedProduct = await productService.updateProductDetail(
                            createdOrUpdatedProduct.id,
                            { ...createdOrUpdatedProduct, mainImage: imageUrl }
                        );
                    } catch (error) {
                        console.error('Error uploading image for new product:', error);
                        message.warning('Sản phẩm đã được tạo nhưng không thể tải lên hình ảnh');
                    }
                }
                // CASE 3: Upload ảnh cho các biến thể sau khi đã tạo sản phẩm
                if (Object.keys(tempVariantImages).length > 0) {
                    // Lấy biến thể sau khi đã tạo sản phẩm
                    const createdVariants = createdOrUpdatedProduct.variantGroups || [];

                    // Duyệt qua từng ảnh biến thể tạm
                    for (const key in tempVariantImages) {
                        try {
                            // Parse key để lấy groupIndex và variantIndex ban đầu
                            const [groupIndex, variantIndex] = key.split('-').map(Number);

                            // Lấy ID của biến thể đã tạo từ vị trí tương ứng
                            if (createdVariants[groupIndex] && createdVariants[groupIndex].variants[variantIndex]) {
                                const variantId = createdVariants[groupIndex].variants[variantIndex].id;

                                // Upload ảnh cho biến thể
                                const imageUrl = await productService.uploadVariantImage(
                                    createdOrUpdatedProduct.id,
                                    variantId,
                                    tempVariantImages[key]
                                );

                                // Cập nhật URL ảnh cho biến thể
                                await productService.updateVariantImage(
                                    createdOrUpdatedProduct.id,
                                    variantId,
                                    imageUrl
                                );
                            }
                        } catch (error) {
                            console.error(`Lỗi upload ảnh biến thể ${key}:`, error);
                        } finally {
                            setLoading(false);
                            // Reset tempVariantImages nếu thành công
                            setTempVariantImages({});
                        }
                    }

                    // Lấy lại thông tin sản phẩm sau khi cập nhật tất cả ảnh biến thể
                    createdOrUpdatedProduct = await productService.getProductDetail(createdOrUpdatedProduct.id);
                }

                if (pendingImages.length > 0) {
                    try {
                        for (const imageFile of pendingImages) {
                            await productService.uploadProductExtraImage(createdOrUpdatedProduct.id, imageFile);
                        }
                        message.success(`${pendingImages.length} hình ảnh đã được tải lên`);
                        setPendingImages([]);
                    } catch (error) {
                        console.error('Error uploading pending images:', error);
                        message.warning('Một số hình ảnh có thể không được tải lên thành công');
                    }
                }

                message.success('Tạo sản phẩm mới thành công');
                if (onProductCreated) {
                    onProductCreated(createdOrUpdatedProduct);
                }
            } else {
                // Cập nhật sản phẩm hiện có
                createdOrUpdatedProduct = await productService.updateProductDetail(productDetail!.id, productData);
                message.success('Cập nhật sản phẩm thành công');
            }

            // Cập nhật state và đóng modal
            if (createdOrUpdatedProduct) {
                setProductDetail({
                    ...createdOrUpdatedProduct,
                    discountPercent: discountPercentValue // Đảm bảo state được cập nhật đúng
                });
            }
            setEditMode(false);
            setIsCreating(false);

            if (isCreating) {
                onClose(); // Đóng modal sau khi tạo thành công
            }
        } catch (error: unknown) {
            console.error('Error saving product:', error);
            const errorMessage = error && typeof error === 'object' && 'message' in error
                ? String(error.message)
                : 'Lỗi không xác định';
            message.error('Có lỗi xảy ra khi lưu sản phẩm: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Thêm nhóm biến thể mới
    const handleAddVariantGroup = () => {
        const newGroup: ProductVariantGroup = {
            name: '',
            variants: []
        };
        setEditingVariantGroups([...editingVariantGroups, newGroup]);
    };

    // Cập nhật tên nhóm biến thể
    const handleUpdateGroupName = (index: number, newName: string) => {
        const updatedGroups = [...editingVariantGroups];
        updatedGroups[index].name = newName;
        setEditingVariantGroups(updatedGroups);
    };

    // Xóa nhóm biến thể
    const handleDeleteVariantGroup = (index: number) => {
        // Nếu xóa nhóm biến thể cha thì phải cập nhật lại
        if (index === selectedParentGroup) {
            setSelectedParentGroup(-1);
        } else if (index < selectedParentGroup) {
            // Nếu xóa nhóm biến thể ở trước nhóm cha, thì index của nhóm cha giảm đi 1
            setSelectedParentGroup(selectedParentGroup - 1);
        }

        const updatedGroups = [...editingVariantGroups];
        updatedGroups.splice(index, 1);
        setEditingVariantGroups(updatedGroups);
    };

    // Thiết lập nhóm biến thể cha
    const handleSetAsParentGroup = (index: number) => {
        // Nếu đã có nhóm cha khác, cần cập nhật toàn bộ biến thể con
        if (selectedParentGroup !== -1 && selectedParentGroup !== index) {
            const updatedGroups = [...editingVariantGroups];

            // Xóa tất cả biến thể con liên kết với nhóm cha cũ
            for (let i = 0; i < updatedGroups.length; i++) {
                if (i !== selectedParentGroup && i !== index) {
                    updatedGroups[i].variants = updatedGroups[i].variants.filter(
                        variant => !variant.parentId || !updatedGroups[selectedParentGroup].variants
                            .some(parentVariant => parentVariant.id === variant.parentId)
                    );
                }
            }

            // Cập nhật parentId của tất cả biến thể cha hiện tại thành undefined
            updatedGroups[selectedParentGroup].variants.forEach(variant => {
                variant.parentId = undefined;
            });

            setEditingVariantGroups(updatedGroups);
        }

        setSelectedParentGroup(index);
    };

    // Thêm biến thể vào một nhóm
    const handleAddVariant = (groupIndex: number) => {
        const updatedGroups = [...editingVariantGroups];
        const newVariant: ProductVariant = {
            id: -Math.floor(Math.random() * 1000), // ID tạm thời
            key: updatedGroups[groupIndex].name, // Key là tên của nhóm biến thể
            value: '',
            quantity: 0,
            parentId: groupIndex === selectedParentGroup ? undefined : undefined
        };

        updatedGroups[groupIndex].variants.push(newVariant);
        setEditingVariantGroups(updatedGroups);
    };


    // Mở modal chỉnh sửa biến thể
    const handleEditVariant = (groupIndex: number, variant: ProductVariant) => {
        setCurrentEditingVariant({ ...variant, groupIndex });
        setIsEditingVariant(true);
    };

    // Sửa lại hàm handleUpdateVariant
    const handleUpdateVariant = <K extends keyof ProductVariant>(
        groupIndex: number,
        variantIndex: number,
        field: K,
        value: ProductVariant[K]
    ) => {
        const updatedGroups = [...editingVariantGroups];
        updatedGroups[groupIndex].variants[variantIndex][field] = value;
        setEditingVariantGroups(updatedGroups);

        // Nếu đang cập nhật quantity cho biến thể con, tính lại số lượng biến thể cha
        if (field === 'quantity' && selectedParentGroup !== -1 && groupIndex !== selectedParentGroup) {
            // Thực hiện sau khi state đã được cập nhật
            setTimeout(() => recalculateParentQuantities(), 0);
        }
    };

    // Xóa biến thể
    const handleDeleteVariant = (groupIndex: number, variantIndex: number) => {
        const updatedGroups = [...editingVariantGroups];
        const deletedVariant = updatedGroups[groupIndex].variants[variantIndex];

        // Nếu xóa biến thể cha, phải xóa tất cả biến thể con liên kết với nó
        if (groupIndex === selectedParentGroup && deletedVariant.parentId === null) {
            for (let i = 0; i < updatedGroups.length; i++) {
                if (i !== selectedParentGroup) {
                    updatedGroups[i].variants = updatedGroups[i].variants.filter(
                        variant => variant.parentId !== deletedVariant.id
                    );
                }
            }
        }

        updatedGroups[groupIndex].variants.splice(variantIndex, 1);
        setEditingVariantGroups(updatedGroups);
    };

    // Cập nhật hàm handleVariantImageUpload
    const handleVariantImageUpload = async (groupIndex: number, variantIndex: number, file: File) => {
        // Kiểm tra nếu đang tạo mới sản phẩm
        if (isCreating) {
            // Tạo key duy nhất cho cặp variant
            const variantKey = `${groupIndex}-${variantIndex}`;

            // Lưu file ảnh vào state tạm
            setTempVariantImages(prev => ({
                ...prev,
                [variantKey]: file
            }));

            // Tạo URL tạm thời để hiển thị preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const tempUrl = e.target?.result as string;

                const updatedGroups = [...editingVariantGroups];
                updatedGroups[groupIndex].variants[variantIndex].photo = 'pending-upload';

                setEditingVariantGroups(updatedGroups);
            };
            reader.readAsDataURL(file);

            return;
        }

        // Xử lý upload nếu đang chỉnh sửa sản phẩm hiện có
        if (!productDetail) return;

        try {
            const variantId = editingVariantGroups[groupIndex].variants[variantIndex].id;
            const imageUrl = await productService.uploadVariantImage(productDetail.id, variantId, file);

            const updatedGroups = [...editingVariantGroups];
            updatedGroups[groupIndex].variants[variantIndex].photo = imageUrl;
            setEditingVariantGroups(updatedGroups);

            message.success('Tải lên hình ảnh biến thể thành công');
        } catch (error) {
            console.error('Lỗi khi tải lên hình ảnh biến thể:', error);
            message.error('Không thể tải lên hình ảnh biến thể');
        }
    };


    const handleBrandChange = async (brandId: number) => {
        // Reset category selection
        form.setFieldsValue({ categoryId: undefined });

        if (brandId) {
            try {
                setLoadingCategories(true);
                // Lấy các categories liên quan đến brand được chọn
                const filteredCategories = await productService.getCategoriesByBrand(brandId);
                setCategories(filteredCategories);
            } catch (error) {
                console.error("Failed to load categories for brand:", error);
            } finally {
                setLoadingCategories(false);
            }
        } else {
            // Reset về tất cả categories nếu không chọn brand
            try {
                setLoadingCategories(true);
                const allCategories = await productService.getAllCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error("Failed to load all categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        }
    };

    // Thêm hàm này vào component
    const recalculateParentQuantities = () => {
        if (selectedParentGroup === -1 || !editingVariantGroups.length) return;

        const updatedGroups = [...editingVariantGroups];
        const parentVariants = updatedGroups[selectedParentGroup].variants;

        // Duyệt qua từng biến thể cha
        parentVariants.forEach((parentVariant, parentIndex) => {
            let totalChildQuantity = 0;

            // Tính tổng số lượng từ các biến thể con có liên kết với biến thể cha này
            for (let i = 0; i < updatedGroups.length; i++) {
                if (i !== selectedParentGroup) {
                    updatedGroups[i].variants.forEach(childVariant => {
                        if (childVariant.parentId === parentVariant.id) {
                            totalChildQuantity += childVariant.quantity || 0;
                        }
                    });
                }
            }

            // Cập nhật số lượng cho biến thể cha
            updatedGroups[selectedParentGroup].variants[parentIndex].quantity = totalChildQuantity;
        });

        setEditingVariantGroups(updatedGroups);
    };

    const handleDisableProduct = () => {
        if (!productDetail) return;

        // Show confirmation dialog
        Modal.confirm({
            title: 'Xác nhận ngừng kinh doanh',
            content: `Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm "${productDetail.name}" không?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setLoading(true);
                    // Call API to update product status
                    await productService.setProductEnabled(productDetail.id, false);

                    // Update local state
                    setProductDetail({
                        ...productDetail,
                        enabled: false
                    });

                    message.success('Đã ngừng kinh doanh sản phẩm thành công');
                } catch (error) {
                    console.error('Error disabling product:', error);
                    message.error('Có lỗi xảy ra khi cập nhật trạng thái sản phẩm');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    //const cho product images
    const fetchProductImages = async (productId: number) => {
        if (!productId) return;
        
        setLoadingImages(true);
        try {
            const images = await productService.getProductImages(productId);
            setProductImages(images);
        } catch (error) {
            console.error('Error loading product images:', error);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleUploadProductImage = async (info: any) => {
        if (!info.file) return;
        
        // Check file size and type
        if (info.file.size > 5 * 1024 * 1024) {
            message.error('Kích thước ảnh không được vượt quá 5MB');
            return;
        }
    
        const isImage = info.file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ chấp nhận file ảnh');
            return;
        }
    
        if (isCreating) {
            // Store the file for later upload after product creation
            setPendingImages([...pendingImages, info.file]);
            
            // Add a preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    id: Date.now(), // Temporary ID
                    url: e.target?.result as string,
                    file: info.file,
                    isPending: true
                };
                setProductImages([...productImages, newImage]);
            };
            reader.readAsDataURL(info.file);
            
            return;
        }
        
        // Normal upload for existing products
        setUploadingImage(true);
        try {
            const response = await productService.uploadProductExtraImage(productDetail!.id, info.file);
            setProductImages([...productImages, response]);
            message.success('Tải lên hình ảnh thành công');
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Không thể tải lên hình ảnh');
        } finally {
            setUploadingImage(false);
        }
    };


    const handleDeleteProductImage = (imageId: number) => {
        setImageToDelete(imageId);
        setConfirmDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete || !productDetail) return;
        
        try {
            await productService.deleteProductImage(productDetail.id, imageToDelete);
            setProductImages(productImages.filter(img => img.id !== imageToDelete));
            message.success('Xóa hình ảnh thành công');
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Không thể xóa hình ảnh');
        } finally {
            setConfirmDeleteModalVisible(false);
        }
    };


    // Render biến thể sản phẩm
    const renderProductVariants = (variantGroups: ProductVariantGroup[]) => {
        return variantGroups.map((group, index) => (
            <Card key={index} title={group.name} style={{ marginBottom: 16 }}>
                <Table
                    dataSource={group.variants}
                    rowKey="id"
                    pagination={false}
                    columns={[
                        {
                            title: 'Giá trị',
                            dataIndex: 'value',
                            key: 'value',
                            render: (value: string, record: ProductVariant) => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {record.photo && (
                                        <Image
                                            src={record.photo === 'pending-upload' ?
                                                'https://placehold.co/40x40/eee/999?text=Pending' :
                                                record.photo}
                                            alt={value}
                                            width={40}
                                            height={40}
                                            style={{ marginRight: 10, objectFit: 'cover' }}
                                            fallback="https://placehold.co/40x40/eee/ccc?text=No+Image"
                                        />
                                    )}
                                    {value}
                                </div>
                            ),
                        },
                        {
                            title: 'Số lượng',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            render: (quantity: number) => (
                                <Tag color={quantity > 10 ? 'green' : quantity > 0 ? 'gold' : 'red'}>
                                    {quantity}
                                </Tag>
                            ),
                        },
                        {
                            title: 'Thao tác',
                            key: 'action',
                            render: (_: any, record: ProductVariant) => (
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<EditOutlined />}
                                >
                                    Cập nhật
                                </Button>
                            ),
                        },
                    ]}
                />
            </Card>
        ));
    };

    // Thêm hàm renderEditForm vào component
    const renderEditForm = () => (
        <Form form={form} layout="vertical">
            <Tabs defaultActiveKey="basic">
                <TabPane tab="Thông tin cơ bản" key="basic">
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card title="Hình ảnh sản phẩm">
                                <div style={{ textAlign: 'center' }}>
                                    <Image
                                        src={previewImage || productDetail?.mainImage}
                                        alt={productDetail?.name}
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                        fallback="https://placehold.co/300x300/eee/ccc?text=No+Image"
                                    />
                                    <Upload
                                        beforeUpload={() => false}
                                        onChange={handleImageUpload}
                                        showUploadList={false}
                                        accept="image/*"
                                    >
                                        <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                                            Chọn ảnh mới
                                        </Button>
                                    </Upload>
                                </div>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Form.Item label="Mã sản phẩm">
                                {isCreating ? (
                                    <Input value="Được tạo tự động" disabled style={{ color: '#999' }} />
                                ) : (
                                    <Input value={productDetail?.id} disabled />
                                )}
                            </Form.Item>

                            <Form.Item
                                name="name"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Giá bán"
                                rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                            <Form.Item
                                name="cost"
                                label="Giá vốn"
                                rules={[{ required: true, message: 'Vui lòng nhập giá vốn' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                            <Form.Item
                                name="discountPercent"
                                label="Giảm giá (%)"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={100}
                                    precision={2} // Thêm dòng này để giới hạn số thập phân
                                    formatter={value => `${value}%`}
                                    parser={value => value!.replace('%', '')}
                                />
                            </Form.Item>
                            <Form.Item label="Tồn kho">
                                <InputNumber style={{ width: '100%' }} value={productDetail?.quantity} disabled />
                            </Form.Item>
                            <Form.Item
                                name="enabled"
                                label="Trạng thái"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Đang kinh doanh"
                                    unCheckedChildren="Ngừng kinh doanh"

                                />
                            </Form.Item>

                            <Form.Item
                                name="brandId"
                                label="Thương hiệu"
                            >
                                <Select
                                    placeholder="Chọn thương hiệu"
                                    loading={loadingBrands}
                                    onChange={handleBrandChange}
                                    allowClear
                                >
                                    {brands.map(brand => (
                                        <Select.Option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="categoryId"
                                label="Danh mục"
                            >
                                <Select
                                    placeholder="Chọn danh mục"
                                    loading={loadingCategories}
                                    allowClear
                                >
                                    {categories.map(category => (
                                        <Select.Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="fullDescription"
                        label="Mô tả chi tiết"
                    >
                        {(productDetail || isCreating) ? (
                            <Editor
                                key={`editor-${productDetail?.id || 'new'}`} // Thêm key để buộc re-render khi sản phẩm thay đổi
                                apiKey="1gf2d40ig6pfoi0jlsv85ievanotehq2i15duc4iiouxyd2m"
                                initialValue={editorContent}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    language: 'vi',
                                    directionality: 'ltr',
                                    setup: (editor: any) => {
                                        editor.on('init', function (e: any) {
                                            editor.getBody().dir = 'ltr';
                                            editor.getBody().style.textAlign = 'left';
                                            editor.execCommand('SelectAll');
                                            editor.execCommand('mceDirectionLTR');
                                        });
                                    },
                                    content_css: 'default,ltr',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                                        'directionality'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                        'bold italic backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'image | removeformat | help',
                                    content_style: 'body, p, h1, h2, h3, h4, h5, h6, div, span { direction: ltr !important; text-align: left !important; } * { direction: ltr !important; }',
                                    // Cấu hình upload ảnh
                                    images_upload_url: 'http://localhost:8080/api/products/image-upload',  // Thay thế bằng URL API upload ảnh của bạn
                                    automatic_uploads: true,
                                    images_reuse_filename: true,
                                    file_picker_types: 'image',
                                    default_text_direction: 'ltr',
                                    // Giới hạn kích thước ảnh
                                    images_upload_handler: function (blobInfo: { blob: () => Blob; filename: () => string | undefined; }, success: (arg0: any) => void, failure: (arg0: string) => void) {
                                        const blob = blobInfo.blob();
                                        const file = new File([blob], blobInfo.filename() || 'image.png', { type: blob.type });

                                        productService.uploadEditorImage(file)
                                            .then(imageUrl => {
                                                success(imageUrl);
                                            })
                                            .catch(err => {
                                                console.error('Upload error:', err);
                                                failure(`Không thể tải lên hình ảnh: ${err.message}`);
                                            });
                                    },
                                }}
                                onEditorChange={(content: string, editor: any): void => {
                                    setEditorContent(content); // Lưu vào state
                                    form.setFieldsValue({ fullDescription: content });
                                }}
                            />
                        ) : (
                            <Spin />
                        )}
                    </Form.Item>
                </TabPane>
                <TabPane tab="Hình ảnh sản phẩm" key="images">
                    {loadingImages ? (
                        <div style={{ textAlign: 'center', padding: '30px' }}>
                            <Spin size="large" />
                        </div>
                    ) : productImages.length > 0 ? (
                        <div>
                            <Row gutter={[16, 16]}>
                                {productImages.map(image => (
                                    <Col span={6} key={image.id}>
                                        <Card
                                            hoverable
                                            cover={
                                                <Image
                                                    src={image.url}
                                                    alt="Product image"
                                                    style={{ height: 200, objectFit: 'cover' }}
                                                    fallback="https://placehold.co/300x200/eee/ccc?text=No+Image"
                                                />
                                            }
                                            actions={editMode ? [
                                                <DeleteOutlined
                                                    key="delete"
                                                    onClick={() => handleDeleteProductImage(image.id)}
                                                    style={{ color: '#ff4d4f' }}
                                                />
                                            ] : []}
                                        >
                                            <Typography.Paragraph ellipsis={{ rows: 1 }} copyable>
                                                {image.url}
                                            </Typography.Paragraph>
                                        </Card>
                                    </Col>
                                ))}

                                {editMode && (
                                    <Col span={6}>
                                        <Upload
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={handleUploadProductImage}
                                            accept="image/*"
                                        >
                                            {uploadingImage ? <LoadingOutlined /> : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    ) : (
                        <Empty
                            description={
                                <>
                                    <div>Chưa có hình ảnh nào</div>
                                    {editMode && (
                                        <Upload
                                            listType="picture-card"
                                            showUploadList={false}
                                            beforeUpload={() => false}
                                            onChange={handleUploadProductImage}
                                            accept="image/*"
                                            style={{ marginTop: 16 }}
                                        >
                                            {uploadingImage ? <LoadingOutlined /> : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                                </div>
                                            )}
                                        </Upload>
                                    )}
                                </>
                            }
                        />
                    )}
                </TabPane>               
                <TabPane tab="Kích thước sản phẩm" key="dimensions">
                    <Card title="Thông tin kích thước và trọng lượng">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    name="weight"
                                    label="Trọng lượng (kg)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        step={0.01}
                                        precision={2}
                                        placeholder="Nhập trọng lượng (kg)"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="height"
                                    label="Chiều cao (cm)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        step={0.1}
                                        precision={1}
                                        placeholder="Nhập chiều cao (cm)"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="width"
                                    label="Chiều rộng (cm)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        step={0.1}
                                        precision={1}
                                        placeholder="Nhập chiều rộng (cm)"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="length"
                                    label="Chiều dài (cm)"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={0}
                                        step={0.1}
                                        precision={1}
                                        placeholder="Nhập chiều dài (cm)"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </TabPane>
                <TabPane tab="Thông số kỹ thuật" key="specifications">
                    <div style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            onClick={handleAddSpec}
                            icon={<PlusOutlined />}
                        >
                            Thêm thông số
                        </Button>
                    </div>
                    <Table
                        dataSource={specs}
                        rowKey="id"
                        pagination={false}
                        bordered
                        columns={[
                            {
                                title: 'Tên thông số',
                                dataIndex: 'name',
                                key: 'name',
                                width: '40%',
                                render: (text, record) => (
                                    <Input
                                        value={text}
                                        onChange={(e) => handleSpecChange(record.id, 'name', e.target.value)}
                                        placeholder="Nhập tên thông số"
                                    />
                                ),
                            },
                            {
                                title: 'Giá trị',
                                dataIndex: 'value',
                                key: 'value',
                                render: (text, record) => (
                                    <Input
                                        value={text}
                                        onChange={(e) => handleSpecChange(record.id, 'value', e.target.value)}
                                        placeholder="Nhập giá trị"
                                    />
                                ),
                            },
                            {
                                title: 'Thao tác',
                                key: 'action',
                                width: 100,
                                render: (_, record) => (
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteSpec(record.id)}
                                    />
                                ),
                            },
                        ]}
                    />
                </TabPane>

                <TabPane tab="Biến thể sản phẩm" key="variants">
                    <div style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            onClick={handleAddVariantGroup}
                            icon={<PlusOutlined />}
                        >
                            Thêm nhóm biến thể
                        </Button>
                    </div>

                    {editingVariantGroups.length === 0 ? (
                        <Empty description="Sản phẩm chưa có biến thể" />
                    ) : (
                        <div>
                            {editingVariantGroups.map((group, groupIndex) => (
                                <Card
                                    key={groupIndex}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Input
                                                value={group.name}
                                                placeholder="Tên nhóm biến thể (vd: Màu sắc, Kích cỡ)"
                                                onChange={(e) => handleUpdateGroupName(groupIndex, e.target.value)}
                                                style={{ marginRight: 16, width: '300px' }}
                                            />
                                            <Button
                                                type={selectedParentGroup === groupIndex ? "primary" : "default"}
                                                onClick={() => handleSetAsParentGroup(groupIndex)}
                                                style={{ marginRight: 8 }}
                                            >
                                                {selectedParentGroup === groupIndex ? "Nhóm cha" : "Đặt làm nhóm cha"}
                                            </Button>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteVariantGroup(groupIndex)}
                                            />
                                        </div>
                                    }
                                    style={{ marginBottom: 16 }}
                                    extra={
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={() => handleAddVariant(groupIndex)}
                                        >
                                            Thêm biến thể
                                        </Button>
                                    }
                                >
                                    <Table
                                        dataSource={group.variants}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        columns={[
                                            {
                                                title: 'Giá trị',
                                                dataIndex: 'value',
                                                key: 'value',
                                                render: (value: ValueType, record: any, index: number) => (
                                                    <Input
                                                        value={value}
                                                        onChange={(e) => handleUpdateVariant(groupIndex, index, 'value', e.target.value)}
                                                        placeholder={`Giá trị ${group.name}`}
                                                    />
                                                ),
                                            },
                                            {
                                                title: 'Hình ảnh',
                                                dataIndex: 'photo',
                                                key: 'photo',
                                                render: (photo: string | undefined, record: any, index: number) => {
                                                    // Chỉ hiển thị upload ảnh cho nhóm cha
                                                    const isParentGroup = groupIndex === selectedParentGroup;

                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Image
                                                                src={photo}
                                                                alt="Hình ảnh"
                                                                width={40}
                                                                height={40}
                                                                style={{ objectFit: 'cover', marginRight: 8 }}
                                                                fallback="https://placehold.co/40x40/eee/ccc?text=No+Image"
                                                            />
                                                            {isParentGroup && (
                                                                <Upload
                                                                    beforeUpload={() => false}
                                                                    showUploadList={false}
                                                                    accept="image/*"
                                                                    onChange={(info) => {
                                                                        if (info.file && !info.file.url && !info.file.preview) {
                                                                            handleVariantImageUpload(groupIndex, index, info.file as any);
                                                                        }
                                                                    }}
                                                                >
                                                                    <Button size="small" icon={<UploadOutlined />}>Tải ảnh</Button>
                                                                </Upload>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Số lượng',
                                                dataIndex: 'quantity',
                                                key: 'quantity',
                                                render: (quantity: number | null | undefined, record: any, index: number) => (
                                                    <InputNumber
                                                        min={0}
                                                        value={quantity}
                                                        onChange={(value) => handleUpdateVariant(groupIndex, index, 'quantity', value ?? 0)}
                                                    />
                                                ),
                                            },
                                            {
                                                title: selectedParentGroup !== -1 && groupIndex !== selectedParentGroup ? 'Biến thể cha' : '',
                                                dataIndex: 'parentId',
                                                key: 'parentId',
                                                render: (parentId: unknown, record: any, index: number) => {
                                                    // Chỉ hiển thị combobox chọn biến thể cha cho các nhóm không phải là nhóm cha
                                                    if (selectedParentGroup === -1 || groupIndex === selectedParentGroup) {
                                                        return null;
                                                    }

                                                    return (
                                                        <Select
                                                            style={{ width: '100%' }}
                                                            value={parentId}
                                                            onChange={(value) => handleUpdateVariant(groupIndex, index, 'parentId', value as number | undefined)}
                                                            placeholder="Chọn biến thể cha"
                                                        >
                                                            {editingVariantGroups[selectedParentGroup]?.variants.map(parentVariant => (
                                                                <Select.Option key={parentVariant.id} value={parentVariant.id}>
                                                                    {parentVariant.value}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>
                                                    );
                                                },
                                            },
                                            {
                                                title: 'Thao tác',
                                                key: 'action',
                                                width: 120,
                                                render: (_: any, record: any, index: number) => (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteVariant(groupIndex, index)}
                                                    />
                                                ),
                                            },
                                        ].filter(col => col.title !== '')} // Lọc bỏ cột trống
                                    />
                                </Card>
                            ))}
                        </div>
                    )}
                </TabPane>
            </Tabs>
        </Form>
    );


    const VariantEditModal = () => (
        <Modal
            title="Chỉnh sửa biến thể"
            open={isEditingVariant}
            onCancel={() => setIsEditingVariant(false)}
            onOk={() => {
                if (currentEditingVariant) {
                    const { groupIndex, ...variantData } = currentEditingVariant as any;
                    const variants = [...editingVariantGroups[groupIndex].variants];
                    const variantIndex = variants.findIndex(v => v.id === variantData.id);

                    if (variantIndex !== -1) {
                        handleUpdateVariant(groupIndex, variantIndex, 'value', variantData.value);
                        handleUpdateVariant(groupIndex, variantIndex, 'quantity', variantData.quantity);
                        handleUpdateVariant(groupIndex, variantIndex, 'photo', variantData.photo);

                        if (groupIndex !== selectedParentGroup) {
                            handleUpdateVariant(groupIndex, variantIndex, 'parentId', variantData.parentId);
                        }
                    }
                }
                setIsEditingVariant(false);
            }}
        >
            {currentEditingVariant && (
                <Form layout="vertical">
                    <Form.Item label="Giá trị">
                        <Input
                            value={currentEditingVariant.value}
                            onChange={(e) => setCurrentEditingVariant({
                                ...currentEditingVariant,
                                value: e.target.value
                            })}
                        />
                    </Form.Item>
                    <Form.Item label="Số lượng">
                        <InputNumber
                            min={0}
                            value={currentEditingVariant.quantity}
                            onChange={(value) => setCurrentEditingVariant({
                                ...currentEditingVariant,
                                quantity: value as number
                            })}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                    <Form.Item label="Hình ảnh">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src={currentEditingVariant.photo}
                                alt="Hình ảnh biến thể"
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover', marginRight: 16 }}
                                fallback="https://placehold.co/80x80/eee/ccc?text=No+Image"
                            />
                            <Upload
                                beforeUpload={() => false}
                                showUploadList={false}
                                accept="image/*"
                                onChange={(info) => {
                                    if (info.file && !info.file.url && !info.file.preview) {
                                        const groupIndex = (currentEditingVariant as any).groupIndex;
                                        const variantIndex = editingVariantGroups[groupIndex].variants
                                            .findIndex(v => v.id === currentEditingVariant.id);

                                        if (variantIndex !== -1) {
                                            handleVariantImageUpload(groupIndex, variantIndex, info.file as any);
                                        }
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                            </Upload>
                        </div>
                    </Form.Item>
                    {(currentEditingVariant as any).groupIndex !== selectedParentGroup && selectedParentGroup !== -1 && (
                        <Form.Item label="Biến thể cha">
                            <Select
                                value={currentEditingVariant.parentId}
                                onChange={(value) => setCurrentEditingVariant({
                                    ...currentEditingVariant,
                                    parentId: value
                                })}
                                style={{ width: '100%' }}
                            >
                                {editingVariantGroups[selectedParentGroup]?.variants.map(parent => (
                                    <Select.Option key={parent.id} value={parent.id}>
                                        {parent.value}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            )}
        </Modal>
    );


    const renderReviewItem = (review: Review) => (
        <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', marginBottom: 16 }}>
                <Avatar src={review.customerPhoto} size={40} />
                <div style={{ marginLeft: 12 }}>
                    <Typography.Text strong>{review.customerName}</Typography.Text>
                    <div>
                        <Rate disabled defaultValue={review.rating} />
                        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                            {new Date(review.created_at).toLocaleDateString()}
                        </Typography.Text>
                    </div>
                </div>
            </div>

            <Typography.Paragraph>{review.content}</Typography.Paragraph>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LikeOutlined style={{ marginRight: 4 }} />
                <Typography.Text type="secondary">{review.votes} người thấy hữu ích</Typography.Text>
            </div>

            {review.feedback ? (
                <div style={{ marginTop: 16, background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                    <Typography.Text type="secondary" strong>Phản hồi từ cửa hàng:</Typography.Text>
                    <Typography.Paragraph style={{ margin: 0, marginTop: 4 }}>
                        {review.feedback}
                    </Typography.Paragraph>
                </div>
            ) : (
                <Button
                    type="primary"
                    ghost
                    style={{ marginTop: 16 }}
                    onClick={() => handleReplyReview(review)}
                >
                    Phản hồi
                </Button>
            )}
        </Card>
    );

    const [replyModalVisible, setReplyModalVisible] = useState<boolean>(false);
    const [currentReview, setCurrentReview] = useState<Review | null>(null);
    const [replyContent, setReplyContent] = useState<string>('');

    const handleReplyReview = (review: Review) => {
        setCurrentReview(review);
        setReplyContent('');
        setReplyModalVisible(true);
    };

    const handleSubmitReply = async () => {
        if (!currentReview || !replyContent.trim()) return;

        try {
            const updatedReview = await reviewService.addFeedbackToReview(currentReview.id, replyContent);
            if (updatedReview) {
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.id === updatedReview.id ? updatedReview : review
                    )
                );
                message.success('Phản hồi đã được gửi thành công');
                setReplyModalVisible(false);
            }
        } catch (error) {
            message.error('Không thể gửi phản hồi. Vui lòng thử lại.');
        }
    };





    return (
        <>
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={editMode ? () => {
                                if (isCreating) {
                                    onClose();
                                } else {
                                    setEditMode(false);
                                }
                            } : onClose}
                            style={{ marginRight: 10 }}
                        />
                        <span>                        {isCreating ? 'Thêm sản phẩm mới' :
                            editMode ? 'Chỉnh sửa sản phẩm' : 'Chi tiết sản phẩm'}</span>
                    </div>
                }
                open={visible}
                onCancel={editMode ? () => {
                    if (isCreating) {
                        onClose();
                    } else {
                        setEditMode(false);
                    }
                } : onClose}
                width={1000}
                footer={
                    editMode ? [
                        <Button key="cancel" onClick={() => {
                            if (isCreating) {
                                onClose();
                            } else {
                                setEditMode(false);
                            }
                        }}>
                            Hủy
                        </Button>,
                        <Button
                            key="save"
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            loading={loading}
                        >
                            {isCreating ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
                        </Button>,
                    ] : [
                        <Button key="back" onClick={onClose}>
                            Đóng
                        </Button>,
                        <Button
                            key="update"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEditClick}
                        >
                            Cập nhật sản phẩm
                        </Button>,
                    ]
                }
            >
                {loading && !isCreating ? (
                    <div style={{ textAlign: 'center', padding: '30px' }}>
                        <Spin size="large" />
                    </div>
                ) : (editMode || isCreating) ? (
                    renderEditForm()
                ) : productDetail ? (
                    editMode ? renderEditForm() : (
                        <Tabs defaultActiveKey="basic">
                            <TabPane tab="Thông tin cơ bản" key="basic">
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Image
                                            src={productDetail.mainImage}
                                            alt={productDetail.name}
                                            style={{ width: '100%', borderRadius: 8 }}
                                            fallback="https://placehold.co/300x300/eee/ccc?text=No+Image"
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <Descriptions bordered column={1} size="small">
                                            <Descriptions.Item label="Mã sản phẩm">{productDetail.id}</Descriptions.Item>
                                            <Descriptions.Item label="Tên sản phẩm">{productDetail.name}</Descriptions.Item>
                                            <Descriptions.Item label="Giá bán">{productDetail.price.toLocaleString('vi-VN')} đ</Descriptions.Item>
                                            <Descriptions.Item label="Giảm giá">
                                                {productDetail.discountPercent ? `${productDetail.discountPercent}%` : 'Không giảm giá'}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Giá vốn">{productDetail.cost.toLocaleString('vi-VN')} đ</Descriptions.Item>
                                            <Descriptions.Item label="Tổng tồn kho">
                                                <Tag color={productDetail.quantity > 10 ? 'green' : productDetail.quantity > 0 ? 'gold' : 'red'}>
                                                    {productDetail.quantity}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Cập nhật lần cuối">{formatDate(productDetail.lastUpdated)}</Descriptions.Item>
                                            <Descriptions.Item label="Trạng thái">
                                                {productDetail.enabled ? (
                                                    <Tag color="green" icon={<CheckCircleOutlined />}>Đang kinh doanh</Tag>
                                                ) : (
                                                    <Tag color="red" icon={<CloseCircleOutlined />}>Ngừng kinh doanh</Tag>
                                                )}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Thương hiệu">
                                                {productDetail.brandName || "Chưa cập nhật"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Danh mục">
                                                {productDetail.categoryName || "Chưa cập nhật"}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Col>
                                </Row>

                                {productDetail.fullDescription && (
                                    <Card title="Mô tả chi tiết" style={{ marginTop: 16 }}>
                                        <div dangerouslySetInnerHTML={{ __html: productDetail.fullDescription }} />
                                    </Card>
                                )}
                                    </TabPane>
                                    <TabPane tab="Hình ảnh sản phẩm" key="images">
                                        {loadingImages ? (
                                            <div style={{ textAlign: 'center', padding: '30px' }}>
                                                <Spin size="large" />
                                            </div>
                                        ) : productImages.length > 0 ? (
                                            <div>
                                                <Row gutter={[16, 16]}>
                                                    {productImages.map(image => (
                                                        <Col span={6} key={image.id}>
                                                            <Card
                                                                hoverable
                                                                cover={
                                                                    <Image
                                                                        src={image.url}
                                                                        alt="Product image"
                                                                        style={{ height: 200, objectFit: 'cover' }}
                                                                        fallback="https://placehold.co/300x200/eee/ccc?text=No+Image"
                                                                    />
                                                                }
                                                                actions={editMode ? [
                                                                    <DeleteOutlined
                                                                        key="delete"
                                                                        onClick={() => handleDeleteProductImage(image.id)}
                                                                        style={{ color: '#ff4d4f' }}
                                                                    />
                                                                ] : []}
                                                            >
                                                                <Typography.Paragraph ellipsis={{ rows: 1 }} copyable>
                                                                    {image.url}
                                                                </Typography.Paragraph>
                                                            </Card>
                                                        </Col>
                                                    ))}

                                                    {editMode && (
                                                        <Col span={6}>
                                                            <Upload
                                                                listType="picture-card"
                                                                showUploadList={false}
                                                                beforeUpload={() => false}
                                                                onChange={handleUploadProductImage}
                                                                accept="image/*"
                                                            >
                                                                {uploadingImage ? <LoadingOutlined /> : (
                                                                    <div>
                                                                        <PlusOutlined />
                                                                        <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                                                    </div>
                                                                )}
                                                            </Upload>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </div>
                                        ) : (
                                            <Empty
                                                description={
                                                    <>
                                                        <div>Chưa có hình ảnh nào</div>
                                                        {editMode && (
                                                            <Upload
                                                                listType="picture-card"
                                                                showUploadList={false}
                                                                beforeUpload={() => false}
                                                                onChange={handleUploadProductImage}
                                                                accept="image/*"
                                                                style={{ marginTop: 16 }}
                                                            >
                                                                {uploadingImage ? <LoadingOutlined /> : (
                                                                    <div>
                                                                        <PlusOutlined />
                                                                        <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                                                    </div>
                                                                )}
                                                            </Upload>
                                                        )}
                                                    </>
                                                }
                                            />
                                        )}
                                    </TabPane>
                                    <TabPane tab="Kích thước sản phẩm" key="dimensions">
                                        <Card bordered={false}>
                                            <Descriptions bordered column={2} size="small">
                                                <Descriptions.Item label="Trọng lượng">
                                                    {productDetail.weight ? `${productDetail.weight} kg` : 'Chưa cập nhật'}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Chiều cao">
                                                    {productDetail.height ? `${productDetail.height} cm` : 'Chưa cập nhật'}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Chiều rộng">
                                                    {productDetail.width ? `${productDetail.width} cm` : 'Chưa cập nhật'}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Chiều dài">
                                                    {productDetail.length ? `${productDetail.length} cm` : 'Chưa cập nhật'}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </TabPane>
                                    <TabPane tab="Thông số kỹ thuật" key="specifications">
                                        {productDetail.specifications && productDetail.specifications.length > 0 ? (
                                            <Table
                                                dataSource={productDetail.specifications}
                                                columns={specificationColumns}
                                                pagination={false}
                                                rowKey="id"
                                                bordered
                                            />
                                        ) : (
                                            <Empty description="Chưa có thông số kỹ thuật" />
                                        )}
                                    </TabPane>

                                    <TabPane tab="Biến thể sản phẩm" key="variants">
                                        {productDetail.variantGroups && productDetail.variantGroups.length > 0 ? (
                                            renderProductVariants(productDetail.variantGroups)
                                        ) : (
                                            <Empty description="Sản phẩm không có biến thể" />
                                        )}
                                    </TabPane>


                            <TabPane tab="Đánh giá sản phẩm" key="reviews">
                                {loadingReviews ? (
                                    <div style={{ textAlign: 'center', padding: '30px' }}>
                                        <Spin size="large" />
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div>
                                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography.Title level={5}>
                                                {reviews.length} đánh giá
                                            </Typography.Title>
                                        </div>
                                        {reviews.map(review => renderReviewItem(review))}
                                    </div>
                                ) : (
                                    <Empty description="Sản phẩm chưa có đánh giá" />
                                )}
                            </TabPane>

                        </Tabs>
                    )
                ) : (
                    <Empty description="Không tìm thấy thông tin sản phẩm" />
                )}
                <Modal
                    title="Phản hồi đánh giá"
                    open={replyModalVisible}
                    onCancel={() => setReplyModalVisible(false)}
                    onOk={handleSubmitReply}
                    okText="Gửi phản hồi"
                    cancelText="Hủy"
                >
                    {currentReview && (
                        <div>
                            <div style={{ marginBottom: 16 }}>
                                <Typography.Text strong>Đánh giá từ: {currentReview.customerName}</Typography.Text>
                                <div>
                                    <Rate disabled defaultValue={currentReview.rating} />
                                </div>
                                <Typography.Paragraph>{currentReview.content}</Typography.Paragraph>
                            </div>

                            <Form.Item label="Phản hồi của bạn">
                                <Input.TextArea
                                    rows={4}
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    placeholder="Nhập phản hồi của bạn với đánh giá này..."
                                />
                            </Form.Item>
                        </div>
                    )}
                </Modal>
                <Modal
                    title="Xác nhận xóa"
                    open={confirmDeleteModalVisible}
                    onOk={confirmDelete}
                    onCancel={() => setConfirmDeleteModalVisible(false)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                >
                    Bạn có chắc chắn muốn xóa hình ảnh này không?
                </Modal>
            </Modal>
            {VariantEditModal()}
        </>
    );
};

export default ProductDetailModal;



