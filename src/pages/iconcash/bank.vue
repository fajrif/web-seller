<script setup>
import logoIconCash from '@images/logos/iconcash-logo.png'
import { useMessageStore } from '@core/stores/config'

const router = useRouter()
const messageStore = useMessageStore()

const isAddBankAccountDialogVisible = ref(false)
const isEditBankAccountDialogVisible = ref(false)
const isDeleteBankAccountDialogVisible = ref(false)
const isSuccessConfirmationDialogVisible = ref(false)

const newItemId = ref()
const itemId = ref(0)
const itemBankId = ref(0)
const itemBankName = ref('')
const itemAccountNo = ref('')
const itemAccountName = ref('')
const confirmTitle = ref('')
const confirmMessage = ref('')

const { data: dataBankAccounts, execute: fetchBankAccounts } = await useApiCore("/iconcash/query/customerbank/search")

const bankAccountsData = computed(() => dataBankAccounts.value.data)

const checkErrorAccountBank = (bank_id, account_no, msg) => {
  var _msg = msg
  var found = bankAccountsData.value.filter((bank) => bank.bank.id === bank_id && bank.account_number === account_no )
  if(found.length !== 0) {
    _msg = 'Bank Akun sudah terdaftar'
  }
  messageStore.setMessage('error', _msg)
}

const addBankAccount = async (id, bank_id, account_name, account_no) => {
  try {
    /* eslint-disable camelcase */
    const res = await $apiCore("/iconcash/command/disbursement/customerbank", {
      method: 'POST',
      body: {
        account_name: account_name,
        account_number: account_no,
        bank_id: bank_id
      },
    })
    /* eslint-enable */

    // Refetch banks
    fetchBankAccounts()
    confirmTitle.value = "Selamat"
    confirmMessage.value = "Akun bank berhasil ditambahkan"
    isSuccessConfirmationDialogVisible.value = true
  } catch (error) {
    checkErrorAccountBank(bank_id, account_no,'Gagal menambahkan akun bank')
    console.error("Error on add bank account merchant:", error)
  }
}

const updateBankAccount = async (id, bank_id, account_name, account_no) => {
  try {
    /* eslint-disable camelcase */
    const res = await $apiCore(`/iconcash/command/disbursement/customerbank/${id}`, {
      method: 'PUT',
      body: {
        account_name: account_name,
        account_number: account_no,
        bank_id: bank_id
      },
    })
    /* eslint-enable */

    // Refetch banks
    fetchBankAccounts()
    confirmTitle.value = "Selamat"
    confirmMessage.value = "Akun bank berhasil diubah"
    isSuccessConfirmationDialogVisible.value = true
  } catch (error) {
    checkErrorAccountBank(bank_id, account_no,'Gagal update akun bank')
    console.error("Error on add bank account merchant:", error)
  }
}

const deleteBankAccount = async (id) => {
  try {
    const res = await $apiCore(`/iconcash/command/customerbank/${id}`, { method: 'DELETE' })

    // Refetch banks
    fetchBankAccounts()
    let msg = res.message
    messageStore.setMessage('success', msg)
  } catch (error) {
		messageStore.setMessage('error', 'Gagal menghapus akun bank.')
    console.error("Error on delete bank account merchant:", error)
  }
}

const addItem = () => {
  confirmTitle.value = ''
  confirmMessage.value = ''
  itemId.value = 0
  isAddBankAccountDialogVisible.value = true
}

const editItem = (id, bank_id, account_no, account_name) => {
  confirmTitle.value = ''
  confirmMessage.value = ''
  itemId.value = id
  itemBankId.value = bank_id
  itemAccountNo.value = account_no
  itemAccountName.value = account_name
  isEditBankAccountDialogVisible.value = true
}

const deleteItem = (id, bank_name, account_no) => {
  itemId.value = id
  itemBankName.value = bank_name
  itemAccountNo.value = account_no
  isDeleteBankAccountDialogVisible.value = true
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-4">
      <div class="d-flex justify-center">
        <VBtn
          icon="tabler-arrow-narrow-left"
          variant="text"
          color="black"
          class="me-1"
          @click="goBack()"
        />
        <h4 class="text-h4 font-weight-medium">
          Kelola Akun Bank
        </h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          color="primary"
          style="width:fit-content"
          prepend-icon="tabler-plus"
          @click="addItem"
        >
          Tambah Akun Bank
        </VBtn>
      </div>
    </div>
    <VCard>
      <VCardText>
        <VRow>
          <!-- 👉 Bank Account list data	-->
          <VCol cols="12">
            <VTable
              v-if="!isEmpty(bankAccountsData)"
              class="text-no-wrap"
            >
              <thead>
                <tr>
                  <th>
                    Bank
                  </th>
                  <th>
                    Nama Akun
                  </th>
                  <th>
                    No. Rekening
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in bankAccountsData"
                  :key="item.id"
                >
                  <td>
                    <div class="d-flex align-center py-2 gap-x-4 mb-0">
                      <div class="ma-2">
                        <VImg
                          :src="resolveBankLogo(item.bank.id)"
                          width="100"
                        />
                      </div>
                      <span class="text-body-1 font-weight-medium">{{ item.bank.name }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.account_name }}
                  </td>
                  <td>
                    {{ item.account_number }}
                  </td>
                  <td>
                    <div
                      class="d-flex justify-end flex-wrap gap-2"
                    >
                      <VBtn
                        size="small"
                        variant="tonal"
                        color="secondary"
                        @click="editItem(item.id, item.bank.id, item.account_number, item.account_name)"
                      >
                        <VIcon icon="tabler-pencil" />
                      </VBtn>
                      <VBtn
                        size="small"
                        variant="tonal"
                        color="error"
                        @click="deleteItem(item.id, item.bank.name, item.account_number)"
                      >
                        <VIcon icon="tabler-trash" />
                      </VBtn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </VTable>
            <!-- 👉 Empty Bank Account -->
						<template v-else>
							<EmptyData
								description="Anda belum memiliki akun bank di iconcash anda.<br/>Silahkan tambahkan akun bank."
								wrapper-class="px-10 py-15"
								btn-text="Tambah Akun Bank"
								@click-button="addItem"
								/>
						</template>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <AddEditBankAccountDialog
      v-model:is-dialog-visible="isAddBankAccountDialogVisible"
      v-model:item-id="newItemId"
      @form-submitted="addBankAccount"
    />
    <AddEditBankAccountDialog
      v-model:is-dialog-visible="isEditBankAccountDialogVisible"
      v-model:item-id="itemId"
      v-model:bank-id="itemBankId"
      v-model:account-no="itemAccountNo"
      v-model:account-name="itemAccountName"
      @form-submitted="updateBankAccount"
    />
    <DeleteBankAccountDialog
      v-model:is-dialog-visible="isDeleteBankAccountDialogVisible"
      v-model:item-id="itemId"
      v-model:bank-name="itemBankName"
      v-model:account-no="itemAccountNo"
      @form-submitted="deleteBankAccount"
    />
    <SuccessConfirmationDialog
      v-model:is-dialog-visible="isSuccessConfirmationDialogVisible"
      v-model:title="confirmTitle"
      v-model:message="confirmMessage"
    />
  </div>
</template>
