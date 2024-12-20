import { Avatar, Card, Col, List, Row } from '@ht/sprite-ui';
import React, { Component } from 'react';

import type { Dispatch } from '@oula/oula';
import { Link, connect } from '@oula/oula';
import moment from 'moment';
import type { ModalState } from './model';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import type { ActivitiesType, NoticeType } from './data.d';

console.log(styles);
const links = [
  {
    title: '列表页',
    href: '/list',
  },
];

interface WorkplaceProps {
  projectNotice: NoticeType[];
  activities: ActivitiesType[];
  dispatch: Dispatch;
  projectLoading: boolean;
  activitiesLoading: boolean;
}

class Workplace extends Component<WorkplaceProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/init',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/clear',
    });
  }

  renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const { activities, projectNotice, projectLoading, activitiesLoading } =
      this.props;

    return (
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className={styles.projectList}
            style={{ marginBottom: 24 }}
            title="进行中的项目"
            bordered={false}
            loading={projectLoading}
            bodyStyle={{ padding: 0 }}
          >
            {projectNotice.map((item) => (
              <Card.Grid className={styles.projectGrid} key={item.id}>
                <Card bodyStyle={{ padding: 0 }} bordered={false}>
                  <Card.Meta
                    title={
                      <div className={styles.cardTitle}>
                        <Avatar size="small" src={item.logo} />
                        <Link to={item.href}>{item.title}</Link>
                      </div>
                    }
                    description={item.description}
                  />
                  <div className={styles.projectItemContent}>
                    <Link to={item.memberLink}>{item.member || ''}</Link>
                    {item.updatedAt && (
                      <span className={styles.datetime} title={item.updatedAt}>
                        {moment(item.updatedAt).fromNow()}
                      </span>
                    )}
                  </div>
                </Card>
              </Card.Grid>
            ))}
          </Card>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            className={styles.activeCard}
            title="动态"
            loading={activitiesLoading}
          >
            <List<ActivitiesType>
              loading={activitiesLoading}
              renderItem={(item) => this.renderActivities(item)}
              dataSource={activities}
              className={styles.activitiesList}
              size="large"
            />
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{ marginBottom: 24 }}
            title="快速开始 / 便捷导航"
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <EditableLinkGroup links={links} linkElement={Link} />
          </Card>
          <Card
            bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
            bordered={false}
            title="团队"
            loading={projectLoading}
          >
            <div className={styles.members}>
              <Row gutter={48}>
                {projectNotice.map((item) => (
                  <Col span={12} key={`members-item-${item.id}`}>
                    <Link to={item.href}>
                      <Avatar src={item.logo} size="small" />
                      <span className={styles.member}>{item.member}</span>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default connect(
  ({
    dashboard: { projectNotice, activities },
    loading,
  }: {
    dashboard: ModalState;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    projectNotice,
    activities,
    projectLoading: loading.effects['dashboard/fetchProjectNotice'],
    activitiesLoading: loading.effects['dashboard/fetchActivitiesList'],
  })
)(Workplace);
