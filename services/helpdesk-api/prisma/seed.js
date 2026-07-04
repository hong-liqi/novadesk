const {
  PrismaClient,
  TicketStatus,
  TicketPriority,
  MessageType,
  ChannelType,
} = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_IDS = {
  user: '00000000-0000-4000-8000-000000000001',
  org: '00000000-0000-4000-8000-000000000010',
  workspace: '00000000-0000-4000-8000-000000000020',
  customer: '00000000-0000-4000-8000-000000000030',
  contact: '00000000-0000-4000-8000-000000000031',
  channel: '00000000-0000-4000-8000-000000000040',
  ticketOpen: '00000000-0000-4000-8000-000000000050',
  ticketResolved: '00000000-0000-4000-8000-000000000051',
};

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'agent@demo.helpdesk' },
    update: {},
    create: {
      id: SEED_IDS.user,
      email: 'agent@demo.helpdesk',
      name: 'Demo Agent',
    },
  });

  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      id: SEED_IDS.org,
      name: 'Demo Organization',
      slug: 'demo-org',
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'support',
      },
    },
    update: {},
    create: {
      id: SEED_IDS.workspace,
      organizationId: organization.id,
      name: 'Support Workspace',
      slug: 'support',
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
    },
  });

  const customer = await prisma.customer.upsert({
    where: { id: SEED_IDS.customer },
    update: {},
    create: {
      id: SEED_IDS.customer,
      workspaceId: workspace.id,
      name: 'Acme Corp',
      email: 'support@acme.example',
    },
  });

  await prisma.contact.upsert({
    where: { id: SEED_IDS.contact },
    update: {},
    create: {
      id: SEED_IDS.contact,
      customerId: customer.id,
      name: 'Jane Doe',
      email: 'jane@acme.example',
      phone: '+1-555-0100',
    },
  });

  const channel = await prisma.channel.upsert({
    where: {
      workspaceId_name: {
        workspaceId: workspace.id,
        name: 'Email',
      },
    },
    update: {},
    create: {
      id: SEED_IDS.channel,
      workspaceId: workspace.id,
      name: 'Email',
      type: ChannelType.EMAIL,
    },
  });

  const ticketOpen = await prisma.ticket.upsert({
    where: { id: SEED_IDS.ticketOpen },
    update: {},
    create: {
      id: SEED_IDS.ticketOpen,
      workspaceId: workspace.id,
      customerId: customer.id,
      contactId: SEED_IDS.contact,
      assigneeId: user.id,
      channelId: channel.id,
      subject: 'Cannot reset password',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
    },
  });

  await prisma.message.upsert({
    where: { id: '00000000-0000-4000-8000-000000000060' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000060',
      ticketId: ticketOpen.id,
      authorId: user.id,
      body: 'Customer reports login issues after password reset email.',
      type: MessageType.PUBLIC,
    },
  });

  await prisma.ticket.upsert({
    where: { id: SEED_IDS.ticketResolved },
    update: {},
    create: {
      id: SEED_IDS.ticketResolved,
      workspaceId: workspace.id,
      customerId: customer.id,
      subject: 'Billing inquiry resolved',
      status: TicketStatus.RESOLVED,
      priority: TicketPriority.MEDIUM,
    },
  });

  console.log('Seed complete:');
  console.log(`  User ID:       ${user.id}`);
  console.log(`  Workspace ID:  ${workspace.id} (use as X-Tenant-Id)`);
  console.log(`  Organization:  ${organization.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
