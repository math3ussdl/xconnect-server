import axios from 'axios'
import { prisma } from '../../config/prisma'
import { v4 as uuidv4 } from 'uuid'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import emailService from '../../services/email'

export default new (class SessionController {
  /*                  List                   */

  async listPf(request: any, response: any) {
    const allPfs = await prisma.pf.findMany({
      include: {
        donor: true,
      },
    })

    return response.json(allPfs)
  }

  async listPj(request: any, response: any) {
    const allPjs = await prisma.pj.findMany({
      include: {
        donor: true,
      },
    })

    return response.json(allPjs)
  }

  async listONG(request: any, response: any) {
    const allONGs = await prisma.ong.findMany()

    return response.json(allONGs)
  }

  /*                  Create                   */

  async createPf(request: any, response: any) {
    const {
      name,
      surname,
      email,
      password,
      gender,
      birthday,
      cpf,
      phone,
      city,
      state,
    } = request.body

    const pf = await prisma.pf.findUnique({
      where: { cpf },
    })

    if (!pf) {
      const id = uuidv4()

      const hashPwd = await hash(password, 12)

      const newPf = await prisma.pf.create({
        data: {
          name,
          surname,
          gender,
          birthday,
          cpf,
          donor: {
            create: {
              id,
              active: false,
              picture: "",
              hashdelete: "",
              email,
              password: hashPwd,
              phone,
              city,
              state,
            },
          },
        },
      })

      emailService(
        email,
        'Bem-Vindo ao XConnect',
        `
        <h1 style='margin-left:10%'>Bem-Vindo <strong>${name} ${surname}</strong></h1>
        <p>
          Você acaba de realizar o cadastro no XConnect como uma Pessoa Física <br/>
          Para ter acesso à nossa plataforma, siga estes passos: <br/>
  
          >> 1) Digite suas credenciais: <br/>
          <strong>CPF:</strong> ${cpf} <br/>
          <strong>Senha:</strong> a senha que você cadastrou! <br/>
          >> 2) Se Você conseguiu entrar na plataforma, muito bem, divirta-se! <br/>Agora, se não conseguiu,<br/> envie um email para nós agora mesmo: limabrot879@gmail.com e <strong>nos informe o seu problema</strong>
      </p>
        `
      )

      return response.json(newPf)
    } else {
      return response.json({
        error: 'User Already Exists!',
      })
    }
  }

  async createPj(request: any, response: any) {
    const { name, email, password, cnpj, phone, city, state } = request.body

    const pj = await prisma.pj.findUnique({
      where: { cnpj },
    })

    if (!pj) {
      const id = uuidv4()
      const hashPwd = await hash(password, 12)

      const newPj = await prisma.pj.create({
        data: {
          name,
          cnpj,
          donor: {
            create: {
              id,
              active: false,
              picture: "",
              hashdelete: "",
              email,
              password: hashPwd,
              phone,
              city,
              state,
            },
          },
        },
      })

      emailService(
        email,
        'Bem-Vindo ao XConnect',
        `
        <h1 style='margin-left:10%'>Bem-Vindo <strong>${name}</strong></h1>
        <p>
          Você acaba de realizar o cadastro no XConnect como uma Pessoa Jurídica <br/>
          Para ter acesso à nossa plataforma, siga estes passos: <br/>
          >> 1) Digite suas credenciais: <br/>
          <strong>CNPJ:</strong> ${cnpj} <br/>
          <strong>Senha:</strong> a senha que você cadastrou! <br/>
          >> 2) Se Você conseguiu entrar na plataforma, muito bem, divirta-se! <br/>Agora, se não conseguiu,<br/> envie um email para nós agora mesmo: limabrot879@gmail.com e <strong>nos informe o seu problema</strong>
        </p>
        `
      )

      return response.json(newPj)
    } else {
      return response.json({
        error: 'User Already Exists!',
      })
    }
  }

  async createONG(request: any, response: any) {
    const {
      name,
      cnpj,
      email,
      password,
      phone,
      zip,
      address,
      neighborhood,
      complement,
      city,
      state,
      number,
    } = request.body

    const ong = await prisma.ong.findUnique({
      where: { cnpj },
    })

    if (!ong) {
      const hashPwd = await hash(password, 12)

      const newONG = await prisma.ong.create({
        data: {
          name,
          cnpj,
          is_active: false,
          picture: "",
          hashdelete: "",
          password: hashPwd,
          email,
          phone,
          zip,
          address,
          neighborhood,
          complement,
          city,
          state,
          number,
        },
      })

      emailService(
        email,
        'Bem-Vindo ao XConnect',
        `
        <h1 style='margin-left:10%'>Bem-Vindo <strong>${name}</strong></h1>
        <p>
          Você acaba de realizar o cadastro no XConnect como uma ONG <br/>
          Para ter acesso à nossa plataforma, siga estes passos: <br/>
          >> 1) Digite suas credenciais: <br/>
          <strong>CNPJ:</strong> ${cnpj} <br/>
          <strong>Senha:</strong> a senha que você cadastrou! <br/>
          >> 2) Se Você conseguiu entrar na plataforma, muito bem, divirta-se! <br/>Agora, se não conseguiu,<br/> envie um email para nós agora mesmo: limabrot879@gmail.com e <strong>nos informe o seu problema</strong>
        </p>
        `
      )

      return response.json(newONG)
    } else {
      return response.json({
        error: 'ONG Already Exists!',
      })
    }
  }

  /*                  Update                   */

  async updatePf(request: any, response: any) {}

  async updatePj(request: any, response: any) {}

  async updateONG(request: any, response: any) {}

  /*                 Remove                   */

  async removePf(request: any, response: any) {
    const { user_cpf } = request.headers

    const targetPf = await prisma.pf.findUnique({
      where: {
        cpf: user_cpf,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPf) {
      return response.status(404).json({
        err: 'User Not Found!',
      })
    }

    await axios.delete(
      `https://api.imgur.com/3/image/${targetPf.donor?.hashdelete}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    )

    await prisma.donor.delete({
      where: {
        id: targetPf.donor?.id,
      },
    })

    await prisma.pf.delete({
      where: {
        cpf: user_cpf,
      },
    })

    return response.send()
  }

  async removePj(request: any, response: any) {
    const { user_cnpj } = request.headers

    const targetPj = await prisma.pj.findUnique({
      where: {
        cnpj: user_cnpj,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPj) {
      return response.status(404).json({
        err: 'User Not Found!',
      })
    }

    await axios.delete(
      `https://api.imgur.com/3/image/${targetPj.donor?.hashdelete}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    )

    await prisma.donor.delete({
      where: {
        id: targetPj.donor?.id,
      },
    })

    await prisma.pj.delete({
      where: {
        cnpj: user_cnpj,
      },
    })

    return response.send()
  }

  async removeONG(request: any, response: any) {
    const { ong_cnpj } = request.headers

    const targetONG = await prisma.ong.findUnique({
      where: {
        cnpj: ong_cnpj,
      },
    })

    if (!targetONG) {
      return response.status(404).json({
        err: 'ONG Not Found!',
      })
    }

    await axios.delete(
      `https://api.imgur.com/3/image/${targetONG.hashdelete}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      }
    )

    await prisma.ong.delete({
      where: {
        cnpj: ong_cnpj,
      },
    })

    return response.send()
  }

  /*                  Login                   */

  async loginPf(request: any, response: any) {
    const { cpf, password } = request.body

    const targetPf = await prisma.pf.findUnique({
      where: {
        cpf,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPf) {
      return response.status(404).json({ err: 'User Not Found!' })
    }

    const isMatched = await compare(password, targetPf.donor?.password!)

    if (targetPf.donor?.active === false) {
      return response.status(401).json({
        auth: false,
        message: 'Confirm The User Email!',
      })
    }

    if (!isMatched) {
      return response.status(403).json({
        auth: false,
        message: 'Bad Password!',
      })
    }

    var token = sign({ cpf }, 'aklzaoililajh', {
      expiresIn: 3600,
    })

    return response.status(200).json({
      auth: true,
      user: targetPf,
      token,
    })
  }

  async loginPj(request: any, response: any) {
    const { cnpj, password } = request.body

    const targetPj = await prisma.pj.findUnique({
      where: {
        cnpj,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPj) {
      return response.json({ err: 'User Not Found!' })
    }

    const isMatched = await compare(password, targetPj.donor?.password!)

    if (!isMatched) {
      return response.status(404).json({
        auth: false,
        message: 'Bad Password!',
      })
    }

    var token = sign({ cnpj }, 'aklzaoililajh', {
      expiresIn: 3600,
    })

    return response.status(200).json({
      auth: true,
      user: targetPj,
      token,
    })
  }

  async loginONG(request: any, response: any) {
    const { cnpj, password } = request.body

    const targetONG = await prisma.ong.findUnique({
      where: {
        cnpj,
      },
    })

    if (!targetONG) {
      return response.status(404).json({ err: 'ONG Not Found!' })
    }

    const isMatched = await compare(password, targetONG.password!)

    if (!isMatched) {
      return response.status(406).json({
        auth: false,
        message: 'Bad Password!',
      })
    }

    var token = sign({ cnpj }, 'aklzaoililajh', {
      expiresIn: 3600,
    })

    return response.status(200).json({
      auth: true,
      user: targetONG,
      token,
    })
  }

  async activePf(request: any, response: any) {
    const { user_cpf } = request.params

    const targetPf = await prisma.pf.findUnique({
      where: {
        cpf: user_cpf,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPf) {
      return response.json({
        active: false,
        msg: 'User Not Found!',
      })
    } else {
      const updatePf = await prisma.pf.update({
        where: {
          cpf: user_cpf,
        },
        data: {
          donor: {
            update: {
              active: true,
            },
          },
        },
      })

      return response.json({
        active: true,
        Pf: updatePf,
      })
    }
  }

  async activePj(request: any, response: any) {
    const { user_cnpj } = request.params

    const targetPj = await prisma.pj.findUnique({
      where: {
        cnpj: user_cnpj,
      },
      include: {
        donor: true,
      },
    })

    if (!targetPj) {
      return response.json({
        active: false,
        msg: 'User Not Found!',
      })
    } else {
      const updatePj = await prisma.pj.update({
        where: {
          cnpj: user_cnpj,
        },
        data: {
          donor: {
            update: {
              active: true,
            },
          },
        },
      })

      return response.json({
        active: true,
        Pj: updatePj,
      })
    }
  }

  async activeONG(request: any, response: any) {
    const cnpj = request.headers['x-target-cnpj']

    const targetONG = await prisma.ong.findUnique({
      where: {
        cnpj,
      },
    })

    if (!targetONG) {
      return response.json({
        active: false,
        msg: 'ONG Not Found!',
      })
    } else {
      const updateONG = await prisma.ong.update({
        where: {
          cnpj,
        },
        data: {
          is_active: true,
        },
      })

      return response.json({
        active: true,
        ONG: updateONG,
      })
    }
  }
})()
