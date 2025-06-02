import { useState, useEffect } from 'react'
import { Tree, Button, Modal, Form, Input, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { api } from '../services/api'

const CategoryTree = ({
    onSelectCategory,
    expandedKeys,
    onExpandedKeysChange,
    defaultExpanded,
    updateTrigger,
    onDataUpdate
}) => {
    const [categories, setCategories] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editingCategory, setEditingCategory] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [updateTrigger])

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories()
            setCategories(transformToTreeData(data))
        } catch (error) {
            message.error('Failed to fetch categories: ' + error.message);
        }
    }

    const transformToTreeData = (categories, parentKey = '') => {
        if (!categories) return [];

        return categories
            .filter(cat => parentKey ? cat.parentCategoryId : !cat.parentCategoryId)
            .map(cat => ({
                key: parentKey ? `${parentKey}-${cat.id}` : cat.id.toString(),
                title: cat.name,
                children: cat.subcategories && cat.subcategories.length > 0
                    ? transformToTreeData(cat.subcategories, cat.id.toString())
                    : undefined,
                data: cat
            }));
    };

    const handleDrop = async ({ dragNode, node, dropToGap }) => {
        try {
            const dragId = dragNode.data.id
            let newParentId = null

            if (!dropToGap) {
                newParentId = node.data.id
            } else {
                newParentId = node.data.parentCategoryId
            }

            if (isChildOf(dragNode.data, node.data)) {
                message.error("Cannot move a category into its own subcategory");
                return;
            }

            await api.updateCategory(dragId, {
                name: dragNode.data.name,
                parentCategoryId: newParentId
            });

            onDataUpdate();
        } catch (error) {
            message.error('Failed to move category: ' + error);
        }
    };

    const isChildOf = (parentNode, childNode) => {
        if (!childNode.subcategories) return false;

        return childNode.subcategories.some(subcat =>
            subcat.id === parentNode.id || isChildOf(parentNode, subcat)
        );
    };

    const handleAdd = (parentNode = null) => {
        setEditingCategory(parentNode)
        setIsModalVisible(true)
    }

    const handleEdit = (node) => {
        form.setFieldsValue({ name: node.title })
        setEditingCategory({ ...node, isEdit: true })
        setIsModalVisible(true)
    }

    const handleDelete = async (node) => {
        try {
            await api.deleteCategory(node.data.id)
            onDataUpdate()
        } catch (error) {
            message.error(error.message)
        }
    }

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const isEdit = editingCategory?.isEdit;

            if (isEdit) {
                await api.updateCategory(editingCategory.data.id, {
                    name: values.name,
                    parentCategoryId: editingCategory.data.parentCategoryId
                });
            } else {
                await api.createCategory({
                    name: values.name,
                    parentCategoryId: editingCategory?.data?.id || null
                });
            }

            setIsModalVisible(false);
            form.resetFields();
            onDataUpdate();
        } catch (error) {
            message.error('Failed to save category: ' + error);
        }
    };

    const titleRender = (node) => {
        return (
            <div className="tree-node">
                <span>{node.title}</span>
                <div className="tree-node-actions">
                    <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleAdd(node); }}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleEdit(node); }}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleDelete(node); }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="category-tree">
            <div className="tree-header">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAdd()}
                >
                    Add Root Category
                </Button>
            </div>

            <Tree
                showLine
                draggable
                defaultExpandAll={defaultExpanded}
                expandedKeys={expandedKeys}
                onExpand={onExpandedKeysChange}
                onSelect={(keys, { node }) => onSelectCategory(node.data)}
                onDrop={handleDrop}
                treeData={categories}
                titleRender={titleRender}
                allowDrop={() => true}
            />

            <Modal
                title={`${editingCategory?.isEdit ? 'Edit' : 'Add'} Category`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please input category name' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CategoryTree