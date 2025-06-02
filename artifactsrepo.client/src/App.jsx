import { useState, useEffect } from 'react'
import './App.css'
import CategoryTree from './components/CategoryTree'
import ArtifactList from './components/ArtifactList'
import { Layout, ConfigProvider, theme, App as AntApp, Menu, Dropdown, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { StyleProvider } from '@ant-design/cssinjs';

const { Header, Sider, Content } = Layout

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [preferences, setPreferences] = useState(() => {
        const saved = localStorage.getItem('treePreferences')
        return saved ? JSON.parse(saved) : {
            defaultExpanded: false,
            expandedKeys: [],
            artifactsPerPage: 9
        }
    })
    const [treeExpandedKeys, setTreeExpandedKeys] = useState(preferences.expandedKeys)
    const [defaultExpanded, setDefaultExpanded] = useState(preferences.defaultExpanded)
    const [updateTrigger, setUpdateTrigger] = useState(0)

    useEffect(() => {
        localStorage.setItem('treePreferences', JSON.stringify({
            ...preferences,
            expandedKeys: treeExpandedKeys,
            defaultExpanded
        }))
    }, [preferences, treeExpandedKeys, defaultExpanded])

    const handleDataUpdate = () => {
        setUpdateTrigger(prev => prev + 1)
    }

    const handleExpandedKeysChange = (keys) => {
        setTreeExpandedKeys(keys)
    }

    const PreferencesMenu = () => (
        <Menu>
            <Menu.Item
                onClick={() => setDefaultExpanded(!defaultExpanded)}
            >
                Default Expanded: {defaultExpanded ? 'Yes' : 'No'}
            </Menu.Item>
            <Menu.Item
                onClick={() => setPreferences(prev => ({
                    ...prev,
                    artifactsPerPage: prev.artifactsPerPage === 9 ? 12 : 9
                }))}
            >
                Items Per Page: {preferences.artifactsPerPage}
            </Menu.Item>
        </Menu>
    )

    return (
        <StyleProvider>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                        colorBgContainer: 'rgba(31, 31, 31, 0.95)',
                        colorBgElevated: 'rgba(31, 31, 31, 0.95)',
                    }
                }}
            >
                <AntApp>
                    <Layout className="app-layout">
                        <Header className="header">
                            <h1>Software Development Artifacts Repository</h1>
                            <Dropdown overlay={<PreferencesMenu />}>
                                <Button icon={<SettingOutlined />}>Preferences</Button>
                            </Dropdown>
                        </Header>
                        <Layout>
                            <Sider width={300} className="sidebar">
                                <CategoryTree
                                    onSelectCategory={setSelectedCategory}
                                    expandedKeys={treeExpandedKeys}
                                    onExpandedKeysChange={handleExpandedKeysChange}
                                    defaultExpanded={defaultExpanded}
                                    updateTrigger={updateTrigger}
                                    onDataUpdate={handleDataUpdate}
                                />
                            </Sider>
                            <Content className="content">
                                <ArtifactList
                                    selectedCategory={selectedCategory}
                                    updateTrigger={updateTrigger}
                                    onDataUpdate={handleDataUpdate}
                                    itemsPerPage={preferences.artifactsPerPage}
                                />
                            </Content>
                        </Layout>
                    </Layout>
                </AntApp>
            </ConfigProvider>
        </StyleProvider>
    )
}

export default App