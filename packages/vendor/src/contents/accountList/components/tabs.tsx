import { Tabs, Tab, styled } from '@mui/material';

import { useTabState } from '../localStates';

const TabsWrapper = styled(Tabs)(
  () => `
    margin: 6px 0 12px 0;
`
);

const TabWrapper = styled(Tab)(
  ({ theme }) => `
    color:  ${theme.colors.alpha.black[70]};
`
);

const AccountListTabs = () => {
  const [tab, setTab] = useTabState();

  return (
    <TabsWrapper
      value={tab}
      onChange={(e, value) => setTab(value)}
      variant="fullWidth"
    >
      <TabWrapper value={0} label="オファー可能" />
      <TabWrapper value={1} label="オファー済み" />
      <TabWrapper value={2} label="支払い待ち" />
      <TabWrapper value={3} label="入金確認待ち" />
    </TabsWrapper>
  );
};

export default AccountListTabs;