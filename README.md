# defs para fazer: menu de opções (uma def para menu em si e outra sendo um input para selecionar a opção), inserir o produto, pesquisar um produto, atualizar um produto existente e deletar um produto.
import pyodbc

dados_conexao = (
    "Driver ={SQL Server};"
    "Server = desk....;"
    "Database = adega;"
    "UID= id..;"
    "PWD=senha.."
)

conexao = pyodbc.connect(dados_conexao)
   print("Conexão realizada com sucesso!")


cursor = conexao.cursor()


def perguntar():
   conexao = conectar_bd()
    if conexao is None:
        return

    inicializar_bd(conexao)

     while True:
              print('Seja bem vindo!'
        '\nO que deseja fazer? Selecione uma das opções abaixo:')
  try:
    return int(input('1 - Inserir um vinho a lista'
              '\n2 - Deletar um vinho da lista'
              '\n3 - Atualizar informação de um vinho'
              '\n4 - Listar todos os vinhos'
              '\n5 - Sair ---> '))
  except ValueError:
    print('Opção inválida, tente novamente')

if opcao == '1':

#inserir

  nome = input("Nome do vinho: ")
  tipo = input("Tipo de vinho: ")
 try:
    (input("Ano de fabricação: "))
    safra = datetime.strptime(ano, "%Y").date()
    quantidade = int(input("Quantidade (ml): "))
    preço = float(input("Preço (R$): "))
    criar_vinho(conexao,nome,tipo,safra,quantidade,preço)
    print("Vinho inserido com sucesso!")
 except ValueError:
    print("Erro nos valores.")




elif opcao == '2'





def deletar():



def atualizar():



def listar(conexao):
  cursor = conexao.cursor()
  cursor.execute("SELECT * FROM tbl_vinhos")
  tbl_vinhos = cursor.fetchall()
    for vinho in tbl_vinhos:
        print(vinho)



def menu():




menu()



