import { useState, useEffect } from 'react'
import {
    List, Card, Button, Modal, Form, Input,
    Select, Upload, message, Tooltip, Tag
} from 'antd'
import {
    UploadOutlined, DeleteOutlined,
    EditOutlined, DownloadOutlined,
    HistoryOutlined
} from '@ant-design/icons'
import { api } from '../services/api'

const { Option } = Select

const ArtifactList = ({ selectedCategory, updateTrigger, onDataUpdate }) => {
    const [artifacts, setArtifacts] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingArtifact, setEditingArtifact] = useState(null)
    const [form] = Form.useForm()
    const [versionHistoryVisible, setVersionHistoryVisible] = useState(false)
    const [selectedArtifactVersions, setSelectedArtifactVersions] = useState([])
    const [versionModalVisible, setVersionModalVisible] = useState(false)
    const [selectedArtifact, setSelectedArtifact] = useState(null)
    const [versionForm] = Form.useForm()

    useEffect(() => {
        if (selectedCategory?.id) {
            fetchArtifacts()
        } else {
            setArtifacts([])
        }
    }, [selectedCategory?.id, updateTrigger])

    const showVersionHistory = async (artifact) => {
        try {
            const versions = await api.getArtifactVersions(artifact.id)
            setSelectedArtifactVersions(versions)
            setSelectedArtifact(artifact)
            setVersionHistoryVisible(true)
        } catch (error) {
            message.error('Failed to fetch versions: ' + error)
        }
    }

    const handleVersionSubmit = async () => {
        try {
            const values = await versionForm.validateFields()
            await api.addArtifactVersion(selectedArtifact.id, values)
            message.success('Version added successfully')
            showVersionHistory(selectedArtifact)
            setVersionModalVisible(false)
            versionForm.resetFields()
        } catch (error) {
            message.error('Failed to add version: ' + error)
        }
    }

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
                                <Tooltip title="Versions">
                                    <Button
                                        icon={<HistoryOutlined />}
                                        onClick={() => showVersionHistory(artifact)}
                                    />
                                </Tooltip>,
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
            <Modal
                title={`Version History - ${selectedArtifact?.title}`}
                open={versionHistoryVisible}
                footer={[
                    <Button key="add" type="primary" onClick={() => setVersionModalVisible(true)}>
                        Add Version
                    </Button>,
                    <Button key="close" onClick={() => setVersionHistoryVisible(false)}>
                        Close
                    </Button>
                ]}
                onCancel={() => setVersionHistoryVisible(false)}
            >
                <List
                    dataSource={selectedArtifactVersions}
                    renderItem={version => (
                        <List.Item
                            actions={[
                                <Button
                                    icon={<DownloadOutlined />}
                                    href={version.downloadUrl}
                                    target="_blank"
                                >
                                    Download
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={`Version ${version.versionNumber}`}
                                description={version.changes}
                            />
                            <div>{new Date(version.uploadDate).toLocaleDateString()}</div>
                        </List.Item>
                    )}
                />
            </Modal>
            <Modal
                title="Add New Version"
                open={versionModalVisible}
                onOk={handleVersionSubmit}
                onCancel={() => {
                    setVersionModalVisible(false)
                    versionForm.resetFields()
                }}
            >
                <Form form={versionForm}>
                    <Form.Item
                        name="versionNumber"
                        label="Version"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="changes"
                        label="Changes"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="downloadUrl"
                        label="Download URL"
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