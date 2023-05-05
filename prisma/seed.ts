import { Permission, Principal, PrismaClient, Role, Team, Tenant, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    let tenant: Tenant;
    try {
        tenant = await prisma.tenant.findFirstOrThrow({
            where: {
                name: 'test'
            }
        });
    } catch (e) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'test'
            }
        });
    }

    let user: User;
    try {
        user = await prisma.user.create({
            data: {
                email: 'test@test.com',
                password: 'test',
                tenant: {
                    connect: {
                        id: tenant.id
                    }
                }
            }
        });
    } catch (e) {
        user = await prisma.user.findFirst({
            where: {
                email: 'test@test.com'
            }
        });
    }

    let team: Team;
    try {
        team = await prisma.team.findFirstOrThrow({
            where: {
                name: 'test'
            }
        });
    } catch (e) {
        team = await prisma.team.create({
            data: {
                name: 'test',
                tenant: {
                    connect: {
                        id: tenant.id
                    }
                }
            }
        });
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            teams: {
                connect: {
                    id: team.id
                }
            }
        }
    });

    let role: Role;

    try {
        role = await prisma.role.findFirstOrThrow({
            where: {
                name: 'admin'
            }
        });
    } catch (e) {
        role = await prisma.role.create({
            data: {
                name: 'admin',
                tenant: {
                    connect: {
                        id: tenant.id
                    }
                }
            }
        });
    }

    let permission: Permission;
    try {
        permission = await prisma.permission.findFirstOrThrow({
            where: {
                name: 'test.create'
            }
        });
    } catch (e) {
        permission = await prisma.permission.create({
            data: {
                name: 'test.create',
                key: 'test.create',
                tenant: {
                    connect: {
                        id: tenant.id
                    }
                }
            }
        });
    }

    await prisma.role.update({
        where: {
            id: role.id
        },
        data: {
            permissions: {
                connect: {
                    id: permission.id
                }
            }
        }
    });

    let principal: Principal;

    try {
        principal = await prisma.principal.findFirstOrThrow({
            where: {
                name: 'test'
            }
        });
    } catch (e) {
        principal = await prisma.principal.create({
            data: {
                name: 'test',
                tenant: {
                    connect: {
                        id: tenant.id
                    }
                }
            }
        });
    }
    console.log({ tenant, user, team });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
