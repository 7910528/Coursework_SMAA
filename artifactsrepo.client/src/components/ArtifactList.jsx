import { useState, useEffect } from 'react'
import {
    List, Card, Button, Modal, Form, Input,
    Select, Upload, message, Tooltip, Tag
} from 'antd'
import {
    UploadOutlined, DeleteOutlined,
    EditOutlined, DownloadOutlined
} from '@ant-design/icons'
import { api } from '../services/api'

const { Option } = Select

const ArtifactList = ({ selectedCategory, updateTrigger, onDataUpdate }) => {
    const [artifacts, setArtifacts] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingArtifact, setEditingArtifact] = useState(null)
    const [form] = Form.useForm()

    useEffect(() => {
        if (selectedCategory?.id) {
            fetchArtifacts()
        } else {
            setArtifacts([])
        }
    }, [selectedCategory?.id, updateTrigger])

    const fetchArtifacts = async () => {
        if (!selectedCategory?.id) return

        try {
            const data = await api.getArtifacts(selectedCategory.id)
            setArtifacts(data)
        } catch (error) {
            message.error('Failed to fetch artifacts: ' + error.message)
        }
    }

    const handleAdd = () => {
        setEditingArtifact(null)
        setIsModalVisible(true)
    }

    const handleEdit = (artifact) => {
        form.setFieldsValue(artifact)
        setEditingArtifact(artifact)
        setIsModalVisible(true)
    }

    const handleDelete = async (artifactId) => {
        try {
            await api.deleteArtifact(artifactId)
            onDataUpdate()
        } catch (error) {
            message.error('Failed to delete artifact: ' + error)
        }
    }

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            const isEdit = !!editingArtifact

            if (isEdit) {
                await api.updateArtifact(editingArtifact.id, {
                    ...values,
                    categoryId: selectedCategory.id
                })
            } else {
                await api.createArtifact({
                    ...values,
                    categoryId: selectedCategory.id
                })
            }

            setIsModalVisible(false)
            form.resetFields()
            onDataUpdate()
        } catch (error) {
            message.error('Failed to save artifact: ' + error)
        }
    }

    return (
        <div className="artifact-list">
            <div className="list-header">
                <h2>{selectedCategory?.name || 'Select a Category'}</h2>
                {selectedCategory && (
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={handleAdd}
                    >
                        Add Artifact
                    </Button>
                )}
            </div>

            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={artifacts}
                renderItem={artifact => (
                    <List.Item>
                        <Card
                            title={artifact.title}
                            actions={[
                                <Tooltip title="Edit">
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(artifact)}
                                    />
                                </Tooltip>,
                                <Tooltip title="Delete">
                                    <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(artifact.id)}
                                    />
                                </Tooltip>,
                                <Tooltip title="Download">
                                    <Button
                                        icon={<DownloadOutlined />}
                                        href={artifact.url}
                                        target="_blank"
                                    />
                                </Tooltip>
                            ]}
                        >
                            <p>{artifact.description}</p>
                            <Tag color="blue">{artifact.documentationType}</Tag>
                            <Tag color="green">v{artifact.version}</Tag>
                        </Card>
                    </List.Item>
                )}
            />

            <Modal
                title={`${editingArtifact ? 'Edit' : 'Add'} Artifact`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="documentationType"
                        label="Type"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value="API">API</Option>
                            <Option value="Guide">Guide</Option>
                            <Option value="Tutorial">Tutorial</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="programmingLanguage"
                        label="Language"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="framework"
                        label="Framework"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="licenseType"
                        label="License"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ArtifactList